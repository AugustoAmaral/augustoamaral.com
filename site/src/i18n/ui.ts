export type Locale = 'en' | 'pt';

export const ui = {
  en: {
    'nav.experiences': 'experiences',
    'nav.shelf': 'shelf',
    'nav.channel': 'channel',
    'nav.liz': 'liz',
    'nav.principles': 'principles',
    'footer.colophon': 'Built with Astro, hosted on Cloudflare Pages. Set in Instrument Serif, Geist, and Geist Mono.',
    'footer.elsewhere': 'ELSEWHERE',
    'footer.related': 'RELATED',
    'footer.copyright': '©︎ 2018 — 2026',
    'lang.en': 'EN',
    'lang.pt': 'PT',
    'skipToContent': 'Skip to main content',
    'home.heroSubtitle': 'Augusto Amaral — senior software engineer, currently at Spring Health.',
    'home.scroll': '↓  SCROLL',
    'experiences.label': 'I — EXPERIENCES',
    'experiences.h1': 'Four jobs, seven years, told as a story.',
    'experiences.h1.em': 'as a story',
    'experiences.intro': 'The full version — context, decisions, and what I actually learned. For the short version, see',
    'experiences.resumeLink': 'resume.augustoamaral.com',
    'shelf.label': 'II — SHELF',
    'shelf.h1': 'A public bookshelf of small things I made.',
    'shelf.h1.em': 'small things I made',
    'shelf.intro': 'Snippets, demos, half-essays. Some are useful. None are a product.',
    'channel.label': 'III — ABOUT THE CHANNEL',
    'channel.h1': 'O Dev Guto.',
    'channel.intro': 'Engenharia de software em português. Without shouting thumbnails, without \'10 things you didn\'t know about React\', with the parts I had to figure out the hard way.',
    'channel.whyTitle': 'Why I do it',
    'channel.whatTitle': 'What it is, and isn\'t',
    'channel.recentTitle': 'Recent episodes',
    'channel.aboutLink': 'About the channel →',
    'liz.label': 'IV — LIZ',
    'liz.h1': 'Liz.',
    'liz.tagline': 'A small tool that does one annoying thing well. Built for me. Possibly useful for you.',
    'liz.tagline.em': 'one annoying thing well',
    'liz.whatTitle': 'What it is',
    'liz.howTitle': 'How it works',
    'liz.dataTitle': 'What it collects, and why',
    'liz.ctaLink': 'Request beta access ↗',
    'liz.privacyLink': 'full privacy policy →',
    'principles.label': 'V — PRINCIPLES',
    'principles.h1': 'Working on it. Come back later.',
    'principles.h1.em': 'Working on it.',
    'principles.body': 'I\'d rather leave this empty than fill it with platitudes. The notes are accumulating quietly, off-page, until they\'re worth committing to.',
    'principles.back': '← Back home',
    'privacy.label': '§ — PRIVACY',
    'privacy.h1': 'Privacy, plainly.',
    'privacy.intro': 'Umbrella policy covering augustoamaral.com and Liz. Last updated April 2026.',
    'privacy.s01.title': '§01 — THIS SITE',
    'privacy.s01.body': 'augustoamaral.com is a static site on Cloudflare Pages. There are no analytics, no cookies, no third-party scripts. If you visit, the only record is Cloudflare\'s standard request logs, which I do not query.',
    'privacy.s02.title': '§02 — LIZ',
    'privacy.s02.body': 'Liz collects email, session metadata, and error logs. Email is for auth and the digest. Session metadata is what\'s required for the product to work. Error logs go to Sentry with scrubbing rules; nothing personal sits in stack traces by design.',
    'privacy.s03.title': '§03 — DATA REQUESTS',
    'privacy.s03.body': 'If you want your data deleted, email me. I will do it within 30 days and confirm in writing.',
    'privacy.s04.title': '§04 — CHANGES',
    'privacy.s04.body': 'If this policy changes meaningfully, the date above updates and the previous version stays linked from this page.',
  },
  pt: {
    'nav.experiences': 'experiências',
    'nav.shelf': 'biblioteca',
    'nav.channel': 'canal',
    'nav.liz': 'liz',
    'nav.principles': 'princípios',
    'footer.colophon': 'Feito com Astro, hospedado no Cloudflare Pages. Composto em Instrument Serif, Geist e Geist Mono.',
    'footer.elsewhere': 'EM OUTROS LUGARES',
    'footer.related': 'RELACIONADOS',
    'footer.copyright': '©︎ 2018 — 2026',
    'lang.en': 'EN',
    'lang.pt': 'PT',
    'skipToContent': 'Pular para o conteúdo',
    'home.heroSubtitle': 'Augusto Amaral — engenheiro de software sênior, atualmente na Spring Health.',
    'home.scroll': '↓  ROLAR',
    'experiences.label': 'I — EXPERIÊNCIAS',
    'experiences.h1': 'Quatro empregos, sete anos, contados como uma história.',
    'experiences.h1.em': 'como uma história',
    'experiences.intro': 'A versão completa — contexto, decisões e o que realmente aprendi. Para a versão resumida, veja',
    'experiences.resumeLink': 'resume.augustoamaral.com',
    'shelf.label': 'II — BIBLIOTECA',
    'shelf.h1': 'Uma estante pública de pequenas coisas que fiz.',
    'shelf.h1.em': 'pequenas coisas que fiz',
    'shelf.intro': 'Snippets, demos, meios-ensaios. Alguns são úteis. Nenhum é um produto.',
    'channel.label': 'III — SOBRE O CANAL',
    'channel.h1': 'O Dev Guto.',
    'channel.intro': 'Engenharia de software em português. Sem thumbnails gritantes, sem \'10 coisas que você não sabia sobre React\', com as partes que tive que descobrir do jeito difícil.',
    'channel.whyTitle': 'Por que faço isso',
    'channel.whatTitle': 'O que é, e o que não é',
    'channel.recentTitle': 'Episódios recentes',
    'channel.aboutLink': 'Sobre o canal →',
    'liz.label': 'IV — LIZ',
    'liz.h1': 'Liz.',
    'liz.tagline': 'Uma ferramenta pequena que faz uma coisa chata muito bem. Feita pra mim. Possivelmente útil pra você.',
    'liz.tagline.em': 'uma coisa chata muito bem',
    'liz.whatTitle': 'O que é',
    'liz.howTitle': 'Como funciona',
    'liz.dataTitle': 'O que coleta, e por quê',
    'liz.ctaLink': 'Solicitar acesso beta ↗',
    'liz.privacyLink': 'política de privacidade completa →',
    'principles.label': 'V — PRINCÍPIOS',
    'principles.h1': 'Trabalhando nisso. Volte mais tarde.',
    'principles.h1.em': 'Trabalhando nisso.',
    'principles.body': 'Prefiro deixar isso vazio a preencher com platitudes. As notas estão acumulando quietamente, fora da página, até que valham a pena serem publicadas.',
    'principles.back': '← Voltar para o início',
    'privacy.label': '§ — PRIVACIDADE',
    'privacy.h1': 'Privacidade, sem rodeios.',
    'privacy.intro': 'Política abrangente para augustoamaral.com e Liz. Última atualização: abril de 2026.',
    'privacy.s01.title': '§01 — ESTE SITE',
    'privacy.s01.body': 'augustoamaral.com é um site estático no Cloudflare Pages. Sem analytics, sem cookies, sem scripts de terceiros. Se você visitar, o único registro são os logs padrão de requisição do Cloudflare, que não consulto.',
    'privacy.s02.title': '§02 — LIZ',
    'privacy.s02.body': 'Liz coleta e-mail, metadados de sessão e logs de erro. O e-mail é para autenticação e o digest. Metadados de sessão são o que o produto precisa para funcionar. Logs de erro vão para o Sentry com regras de limpeza; nada pessoal fica em stack traces por design.',
    'privacy.s03.title': '§03 — SOLICITAÇÕES DE DADOS',
    'privacy.s03.body': 'Se quiser que seus dados sejam excluídos, me envie um e-mail. Farei isso em 30 dias e confirmarei por escrito.',
    'privacy.s04.title': '§04 — MUDANÇAS',
    'privacy.s04.body': 'Se esta política mudar de forma relevante, a data acima é atualizada e a versão anterior fica vinculada nesta página.',
  },
} as const;

export function getLocaleFromPath(path: string): Locale {
  if (path.startsWith('/pt/') || path === '/pt' || path === '/pt/') {
    return 'pt';
  }
  return 'en';
}

export function getAlternatePath(path: string, target: Locale): string {
  const isPt = path.startsWith('/pt/') || path === '/pt' || path === '/pt/';

  if (target === 'pt') {
    if (isPt) return path;
    if (path === '/' || path === '') return '/pt/';
    return '/pt' + path;
  } else {
    if (!isPt) return path;
    if (path === '/pt/' || path === '/pt') return '/';
    return path.replace(/^\/pt/, '');
  }
}

export function useTranslation(locale: Locale) {
  return function t(key: keyof typeof ui['en']): string {
    return (ui[locale] as typeof ui['en'])[key] ?? ui['en'][key];
  };
}
