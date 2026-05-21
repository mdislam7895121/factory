import { Controller, Get } from '@nestjs/common';

// 10-07: Public policy endpoints — routes accessible without auth
// Content links point to future pages; placeholder text for beta.
@Controller('legal')
export class LegalController {
  @Get('terms')
  terms() {
    return {
      title:       'Terms of Use',
      version:     'beta-1',
      summary:     'By using Factory you agree to use generated apps responsibly. Full terms will be published before public launch.',
      contact:     'legal@factory.dev',
      effectiveAt: '2026-01-01',
    };
  }

  @Get('privacy')
  privacy() {
    return {
      title:   'Privacy Policy',
      version: 'beta-1',
      summary: 'We collect minimal data required to operate the platform. Preview access logs are hashed. No raw IPs stored. Full policy will be published before public launch.',
      contact: 'privacy@factory.dev',
    };
  }

  @Get('abuse')
  abuse() {
    return {
      title:   'Abuse Policy',
      version: 'beta-1',
      summary: 'Abuse of generated apps (malware, phishing, illegal content, spam) will result in immediate termination. Report abuse via POST /p/:id/report.',
      contact: 'abuse@factory.dev',
    };
  }

  @Get('aup')
  aup() {
    return {
      title:   'Acceptable Use Policy',
      version: 'beta-1',
      summary: 'Factory may not be used to generate or host malware, illegal content, or tools designed to harm others. Automated abuse of the platform is prohibited.',
      contact: 'legal@factory.dev',
    };
  }

  @Get('dmca')
  dmca() {
    return {
      title:   'DMCA Contact',
      version: 'beta-1',
      summary: 'To report copyright infringement, contact us at dmca@factory.dev with a description of the content and your ownership claim.',
      contact: 'dmca@factory.dev',
    };
  }
}
