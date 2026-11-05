import type { LocaleCode } from './locales';

interface Strings {
  meta: { title: string; description: string };
  nav: { language: string; download: string; downloadShort: string };
  hero: { eyebrow: string; title: string; lead: string; note: string };
  screens: { plan: string; workout: string; history: string };
  features: { title: string; text: string }[];
  bodyCheck: {
    eyebrow: string;
    title: string;
    text: string;
    before: { label: string; weight: string; alt: string };
    after: { label: string; weight: string; alt: string };
  };
  closing: string;
  footer: { privacy: string; imprint: string; terms: string };
  legal: { back: string; contents: string };
  imprint: {
    title: string;
    basis: string;
    country: string;
    contact: string;
    email: string;
    disputes: string;
    disputesText: string;
  };
}

/** German is the design's copy; the other languages use the app's own words for its features. */
export const STRINGS: Record<LocaleCode, Strings> = {
  de: {
    meta: {
      title: 'Loqqa – Trainings-App für iPhone',
      description:
        'Loqqa führt dich durch deinen Plan, merkt sich jedes Gewicht und zeigt dir, was du beim nächsten Mal schlagen musst.',
    },
    nav: { language: 'Sprache', download: 'Im App Store laden', downloadShort: 'Laden' },
    hero: {
      eyebrow: 'Trainings-App für iPhone',
      title: 'Loqqa merkt sich alles. Du hebst.',
      lead: 'Loqqa führt dich durch deinen Plan, merkt sich jedes Gewicht und zeigt dir, was du beim nächsten Mal schlagen musst.',
      note: 'Kostenlos starten',
    },
    screens: {
      plan: 'Loqqa: Trainingsplan mit den Trainings der Woche',
      workout: 'Loqqa: laufendes Training mit Gewicht und Wiederholungen je Satz',
      history: 'Loqqa: Verlauf des Höchstgewichts einer Übung',
    },
    features: [
      { title: 'Dein Plan', text: 'Alle Trainings auf einen Blick. Ein Tipp, und es geht los.' },
      {
        title: 'Sätze in Sekunden',
        text: 'Gewicht und Wiederholungen mit einem Daumen. Dein letzter Wert steht schon da.',
      },
      { title: 'Jeder Rekord gespeichert', text: 'Dein Verlauf pro Übung, Satz für Satz.' },
    ],
    bodyCheck: {
      eyebrow: 'Körpercheck',
      title: 'Sieh, was sich verändert.',
      text: 'Alle paar Wochen ein Foto. Loqqa legt die Checks nebeneinander.',
      before: { label: 'Check A · 13. Apr', weight: '68,2 kg', alt: 'Körpercheck vom 13. April' },
      after: { label: 'Check B · 7. Sep', weight: '64,1 kg', alt: 'Körpercheck vom 7. September' },
    },
    closing: 'Bereit fürs nächste Training?',
    footer: { privacy: 'Datenschutz', imprint: 'Impressum', terms: 'Nutzungsbedingungen' },
    legal: { back: 'Zur Startseite', contents: 'Inhalt' },
    imprint: {
      title: 'Impressum',
      basis: 'Angaben gemäß § 5 DDG',
      country: 'Deutschland',
      contact: 'Kontakt',
      email: 'E-Mail',
      disputes: 'Verbraucherstreitbeilegung',
      disputesText:
        'Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    },
  },
  en: {
    meta: {
      title: 'Loqqa – Workout app for iPhone',
      description:
        'Loqqa guides you through your plan, remembers every weight and shows you what to beat next time.',
    },
    nav: { language: 'Language', download: 'Download on the App Store', downloadShort: 'Get' },
    hero: {
      eyebrow: 'Workout app for iPhone',
      title: 'Loqqa remembers everything. You lift.',
      lead: 'Loqqa guides you through your plan, remembers every weight and shows you what to beat next time.',
      note: 'Start for free',
    },
    screens: {
      plan: 'Loqqa: training plan with the workouts of the week',
      workout: 'Loqqa: a running workout with weight and reps for each set',
      history: "Loqqa: an exercise's top weight over time",
    },
    features: [
      { title: 'Your plan', text: "All your workouts at a glance. One tap and you're off." },
      {
        title: 'Sets in seconds',
        text: 'Weight and reps with one thumb. Your last numbers are already there.',
      },
      { title: 'Every record saved', text: 'Your history for every exercise, set by set.' },
    ],
    bodyCheck: {
      eyebrow: 'Body check',
      title: 'See what changes.',
      text: 'A photo every few weeks. Loqqa puts the checks side by side.',
      before: { label: 'Check A · Apr 13', weight: '68.2 kg', alt: 'Body check from April 13' },
      after: { label: 'Check B · Sep 7', weight: '64.1 kg', alt: 'Body check from September 7' },
    },
    closing: 'Ready for your next workout?',
    footer: { privacy: 'Privacy', imprint: 'Imprint', terms: 'Terms' },
    legal: { back: 'Back to home', contents: 'Contents' },
    imprint: {
      title: 'Imprint',
      basis: 'Information pursuant to § 5 DDG (German Digital Services Act)',
      country: 'Germany',
      contact: 'Contact',
      email: 'Email',
      disputes: 'Consumer dispute resolution',
      disputesText:
        'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.',
    },
  },
  'pt-PT': {
    meta: {
      title: 'Loqqa – App de treino para iPhone',
      description:
        'O Loqqa guia-te pelo teu plano, lembra-se de cada peso e mostra-te o que tens de superar da próxima vez.',
    },
    nav: { language: 'Idioma', download: 'Descarregar na App Store', downloadShort: 'Obter' },
    hero: {
      eyebrow: 'App de treino para iPhone',
      title: 'O Loqqa lembra-se de tudo. Tu levantas.',
      lead: 'O Loqqa guia-te pelo teu plano, lembra-se de cada peso e mostra-te o que tens de superar da próxima vez.',
      note: 'Começa grátis',
    },
    screens: {
      plan: 'Loqqa: plano de treino com os treinos da semana',
      workout: 'Loqqa: treino em curso com peso e repetições por série',
      history: 'Loqqa: evolução do peso máximo de um exercício',
    },
    features: [
      { title: 'O teu plano', text: 'Todos os treinos num relance. Um toque e começas.' },
      {
        title: 'Séries em segundos',
        text: 'Peso e repetições com um polegar. O teu último valor já lá está.',
      },
      { title: 'Cada recorde guardado', text: 'O teu histórico por exercício, série a série.' },
    ],
    bodyCheck: {
      eyebrow: 'Check corporal',
      title: 'Vê o que muda.',
      text: 'Uma foto de poucas em poucas semanas. O Loqqa põe os checks lado a lado.',
      before: {
        label: 'Check A · 13 abr',
        weight: '68,2 kg',
        alt: 'Check corporal de 13 de abril',
      },
      after: {
        label: 'Check B · 7 set',
        weight: '64,1 kg',
        alt: 'Check corporal de 7 de setembro',
      },
    },
    closing: 'Pronto para o próximo treino?',
    footer: { privacy: 'Privacidade', imprint: 'Informação legal', terms: 'Termos' },
    legal: { back: 'Voltar ao início', contents: 'Índice' },
    imprint: {
      title: 'Informação legal',
      basis: 'Informações nos termos do § 5 DDG (lei alemã dos serviços digitais)',
      country: 'Alemanha',
      contact: 'Contacto',
      email: 'E-mail',
      disputes: 'Resolução de litígios de consumo',
      disputesText:
        'Não estamos dispostos nem obrigados a participar em procedimentos de resolução de litígios perante uma entidade de resolução alternativa de litígios de consumo.',
    },
  },
  'pt-BR': {
    meta: {
      title: 'Loqqa – App de treino para iPhone',
      description:
        'O Loqqa guia você pelo seu plano, lembra cada peso e mostra o que você precisa superar da próxima vez.',
    },
    nav: { language: 'Idioma', download: 'Baixar na App Store', downloadShort: 'Baixar' },
    hero: {
      eyebrow: 'App de treino para iPhone',
      title: 'O Loqqa lembra de tudo. Você levanta.',
      lead: 'O Loqqa guia você pelo seu plano, lembra cada peso e mostra o que você precisa superar da próxima vez.',
      note: 'Comece grátis',
    },
    screens: {
      plan: 'Loqqa: plano de treino com os treinos da semana',
      workout: 'Loqqa: treino em andamento com peso e repetições por série',
      history: 'Loqqa: evolução do peso máximo de um exercício',
    },
    features: [
      { title: 'Seu plano', text: 'Todos os treinos de relance. Um toque e você começa.' },
      {
        title: 'Séries em segundos',
        text: 'Peso e repetições com um polegar. Seu último valor já está lá.',
      },
      { title: 'Cada recorde salvo', text: 'Seu histórico por exercício, série por série.' },
    ],
    bodyCheck: {
      eyebrow: 'Check corporal',
      title: 'Veja o que muda.',
      text: 'Uma foto a cada poucas semanas. O Loqqa coloca os checks lado a lado.',
      before: {
        label: 'Check A · 13 abr',
        weight: '68,2 kg',
        alt: 'Check corporal de 13 de abril',
      },
      after: {
        label: 'Check B · 7 set',
        weight: '64,1 kg',
        alt: 'Check corporal de 7 de setembro',
      },
    },
    closing: 'Pronto para o próximo treino?',
    footer: { privacy: 'Privacidade', imprint: 'Aviso legal', terms: 'Termos' },
    legal: { back: 'Voltar ao início', contents: 'Índice' },
    imprint: {
      title: 'Aviso legal',
      basis: 'Informações conforme o § 5 DDG (lei alemã de serviços digitais)',
      country: 'Alemanha',
      contact: 'Contato',
      email: 'E-mail',
      disputes: 'Resolução de conflitos de consumo',
      disputesText:
        'Não estamos dispostos nem obrigados a participar de procedimentos de resolução de conflitos perante um órgão de conciliação de consumidores.',
    },
  },
  ko: {
    meta: {
      title: 'Loqqa – iPhone 운동 앱',
      description:
        'Loqqa가 플랜을 안내하고, 모든 무게를 기억하고, 다음에 넘어야 할 기록을 보여줍니다.',
    },
    nav: { language: '언어', download: 'App Store에서 다운로드', downloadShort: '받기' },
    hero: {
      eyebrow: 'iPhone 운동 앱',
      title: '기억은 Loqqa가, 운동은 당신이.',
      lead: 'Loqqa가 플랜을 안내하고, 모든 무게를 기억하고, 다음에 넘어야 할 기록을 보여줍니다.',
      note: '무료로 시작',
    },
    screens: {
      plan: 'Loqqa: 이번 주 운동이 담긴 플랜',
      workout: 'Loqqa: 세트별 무게와 횟수를 기록하는 운동 화면',
      history: 'Loqqa: 운동별 최고 무게 기록',
    },
    features: [
      { title: '나의 플랜', text: '모든 운동을 한눈에. 탭 한 번이면 시작합니다.' },
      {
        title: '몇 초 만에 세트 기록',
        text: '무게와 횟수를 엄지 하나로. 지난 기록이 이미 들어가 있어요.',
      },
      { title: '모든 기록 저장', text: '운동별 기록을 세트 단위로.' },
    ],
    bodyCheck: {
      eyebrow: '바디 체크',
      title: '달라진 모습을 확인하세요.',
      text: '몇 주마다 사진 한 장. Loqqa가 체크를 나란히 보여줍니다.',
      before: { label: '체크 A · 4월 13일', weight: '68.2 kg', alt: '4월 13일 바디 체크' },
      after: { label: '체크 B · 9월 7일', weight: '64.1 kg', alt: '9월 7일 바디 체크' },
    },
    closing: '다음 운동, 준비됐나요?',
    footer: { privacy: '개인정보 처리방침', imprint: '사업자 정보', terms: '이용약관' },
    legal: {
      back: '홈으로',
      contents: '목차',
    },
    imprint: {
      title: '사업자 정보',
      basis: '독일 디지털 서비스법(DDG) 제5조에 따른 정보',
      country: '독일',
      contact: '연락처',
      email: '이메일',
      disputes: '소비자 분쟁 해결',
      disputesText: '당사는 소비자 중재 기관의 분쟁 해결 절차에 참여할 의사나 의무가 없습니다.',
    },
  },
};
