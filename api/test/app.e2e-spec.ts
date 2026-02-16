import { Test, TestingModule } from '@nestjs/testing';
import {
  Body,
  Controller,
  INestApplication,
  Module,
  Post,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { applyGlobalValidationBoundary } from './../src/main';
import type { AddressInfo } from 'node:net';

class ValidationProofDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

@Controller('validation-proof')
class ValidationProofController {
  @Post()
  prove(@Body() body: ValidationProofDto) {
    return body;
  }
}

@Module({
  controllers: [ValidationProofController],
})
class ValidationProofTestModule {}

type TestFetchInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

type TestFetchResponse = {
  status: number;
  text: () => Promise<string>;
};

type TestFetch = (
  input: string,
  init?: TestFetchInit,
) => Promise<TestFetchResponse>;

const fetchTyped = globalThis.fetch as unknown as TestFetch;

async function parseJsonUnknown(response: TestFetchResponse): Promise<unknown> {
  const text = await response.text();
  return JSON.parse(text) as unknown;
}

async function getBaseUrl(app: INestApplication): Promise<string> {
  await app.listen(0, '127.0.0.1');
  const rawServer = app.getHttpServer() as unknown;
  const server = rawServer as { address: () => AddressInfo | null };
  const address = server.address();

  if (!address) {
    throw new Error('Unable to resolve test server address');
  }

  return `http://127.0.0.1:${address.port}`;
}

function createNestTestApp(moduleFixture: TestingModule): INestApplication {
  const rawApp = moduleFixture.createNestApplication() as unknown;
  return rawApp as INestApplication;
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let baseUrl = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = createNestTestApp(moduleFixture);
    await app.init();
    baseUrl = await getBaseUrl(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const response = await fetchTyped(`${baseUrl}/`);
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toBe('Hello World!');
  });
});

describe('Validation boundary (e2e)', () => {
  let app: INestApplication;
  let baseUrl = '';

  function expectValidationErrorShape(body: unknown): string[] {
    expect(typeof body).toBe('object');
    expect(body).not.toBeNull();

    const payload = body as Record<string, unknown>;

    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('VALIDATION_ERROR');
    expect(typeof payload.message).toBe('string');
    expect(Array.isArray(payload.details)).toBe(true);

    const details = payload.details as unknown[];
    return details.filter((item): item is string => typeof item === 'string');
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ValidationProofTestModule],
    }).compile();

    app = createNestTestApp(moduleFixture);
    applyGlobalValidationBoundary(app);
    await app.init();
    baseUrl = await getBaseUrl(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('missing body -> structured validation 400', async () => {
    const response = await fetchTyped(`${baseUrl}/validation-proof`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const body = await parseJsonUnknown(response);

    expect(response.status).toBe(400);
    expectValidationErrorShape(body);
  });

  it('extra unknown field -> structured validation 400', async () => {
    const response = await fetchTyped(`${baseUrl}/validation-proof`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'dev@example.com', extra: 'forbidden' }),
    });
    const body = await parseJsonUnknown(response);

    expect(response.status).toBe(400);
    const details = expectValidationErrorShape(body);
    expect(details.join(' | ')).toContain('property extra should not exist');
  });

  it('invalid email -> structured validation 400', async () => {
    const response = await fetchTyped(`${baseUrl}/validation-proof`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    const body = await parseJsonUnknown(response);

    expect(response.status).toBe(400);
    const details = expectValidationErrorShape(body);
    expect(details.join(' | ')).toContain('email must be an email');
  });
});
