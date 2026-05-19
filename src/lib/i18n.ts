import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    resources: {
      en: {
        translation: {
          nav: {
            journey: 'The Experience',
            stories: 'Legacy',
            guide: 'Guide',
            about: 'Philosophy',
          },
          hero: {
            title: 'Unveil the Truth Within',
            subtitle: 'You are not a drop in the ocean. You are the entire ocean in a drop. Explore the environment that birthed the final light.',
            cta: 'Enter the Exhibition',
            scroll: 'Descend into reflection',
          },
          journey: {
            chapter: 'Chapter',
            reflect: 'Reflect',
            insight: 'Dive into Insight',
            proceed: 'Proceed with Insight',
            understand: 'I understand',
            sharePrompt: 'Share your reflection with Nur',
            placeholder: 'What stirs in your heart?',
            inquiry: 'Deep Inquiry',
            scenes: {
              chaos: 'The Age of Shadows',
              mercy: 'Refining the Soul',
              revelation: 'The First Whisper',
              liberation: 'Breaking the Chains',
              destiny: 'The Ultimate Return',
            },
            descriptions: {
              chaos: 'Imagine a world without objective truth. Where strength was the only law, and the weak were sold for a price. This was the "Jahiliyyah"—the darkness of the soul.',
              mercy: 'Before the Prophet was a Messenger, he was "Al-Amin" (The Trustworthy). He unified hearts by the sheer weight of his noble character, even before a word of Quran was spoken.',
              revelation: 'In the silence of Mount Hira, the heavens spoke. "Read!" was the command. Not for power, not for gold, but to reconnect the created with the Creator.',
              liberation: 'Islam did not just change a religion; it abolished the worship of men. It declared that no human is superior to another except by their heart. It was the birth of true freedom.',
              destiny: 'We came from the Infinite, and to the Infinite we return. Truth is not something you learn; it is something you remember.',
            },
            questions: {
              chaos: 'If there is no higher law, what stops the powerful from crushing the weak?',
              mercy: 'Can a message be true if the messenger is not also beautiful?',
              revelation: 'Why did a man who had everything flee to a cave in search of something more?',
              liberation: 'Are you truly free if you are a slave to your own desires or the opinions of others?',
              destiny: 'If today was your last sunset, what would be the signature of your soul?',
            }
          },
          guide: {
            title: 'Nur',
            subtitle: 'The Whispering Light',
            intro: '"I am Nur. Your questions are the sparks that light the path. Speak your heart."',
            input: 'Ask the light...',
            reflecting: 'Reflecting...',
          }
        },
      },
      ar: {
        translation: {
          nav: {
            journey: 'المعرض التفاعلي',
            stories: 'الإرث النبوي',
            guide: 'دليل نور',
            about: 'فلسفة المنصة',
          },
          hero: {
            title: 'اكتشف جوهر الحقيقة',
            subtitle: 'لست مجرد قطرة في المحيط، بل أنت المحيط كله في قطرة. رحلة تأملية في البيئة التي شهدت ميلاد النور الخاتم.',
            cta: 'بدء التجربة',
            scroll: 'انطلق في رحلة التأمل',
          },
          journey: {
            chapter: 'الفصل',
            reflect: 'تأمل',
            insight: 'تعمق في البصيرة',
            proceed: 'تابع بالبصيرة',
            understand: 'فهمت الرسالة',
            sharePrompt: 'شارك تأملاتك مع "نور"',
            placeholder: 'ما الذي يختلج في صدرك؟',
            inquiry: 'تساؤل عميق',
            scenes: {
              chaos: 'عصر الظلال (الجاهلية)',
              mercy: 'تهذيب النفس (الأمين)',
              revelation: 'الهمسة الأولى (اقرأ)',
              liberation: 'كسر الأغلال (الحرية)',
              destiny: 'العودة الأبدية (المصير)',
            },
            descriptions: {
              chaos: 'عالم يفتقر للحقيقة المطلقة، حيث كانت القوة هي القانون، والضعفاء يُسحقون بلا ثمن. تلك كانت "الجاهلية"—ظلمة الروح قبل انبثاق الفجر.',
              mercy: 'قبل الرسالة، كان يُعرف بـ "الأمين". وحّد القلوب بنبل خُلقه، وجذب النفوس بجمال روحه قبل أن تنطق السماء بالوحي.',
              revelation: 'في سكون غار حراء، نادت السماء: "اقرأ!". لم يكن نداءً لسلطة أو جاه، بل لإعادة وصل الإنسان بخالقه المتعال.',
              liberation: 'لم يغير الإسلام المعتقدات فحسب، بل ألغى عبودية البشر للبشر. أعلن أن لا فضل لإنسان على آخر إلا بنقاء قلبه وتقواه.',
              destiny: 'من اللامتناهي جئنا، وإليه نعود. الحقيقة ليست مجرد معلومة تُكتسب، بل هي تذكر لعهد قديم في أعماق الروح.',
            },
            questions: {
              chaos: 'لو لم يكن هناك قانون إلهي، ما الذي قد يمنع القوي من سحق الضعيف؟',
              mercy: 'هل يمكن للرسالة أن تلامس القلوب إذا لم يكن حاملها غاية في الجمال والصدق؟',
              revelation: 'لماذا يترك رجل يمتلك الوجاهة والاستقرار كل شيء ليبحث عن الحقيقة في عزلة غار؟',
              liberation: 'هل تظن نفسك حراً وأنت أسير لرغباتك أو لآراء الناس من حولك؟',
              destiny: 'لو كان هذا غروبك الأخير، فما هو الأثر الذي ستتركه روحك في سجلات الوجود؟',
            }
          },
          guide: {
            title: 'نور',
            subtitle: 'همسات الضياء',
            intro: '"أنا نور.. تساؤلاتك هي الشرر الذي يضيء الطريق. تكلم بما يمليه عليك قلبك."',
            input: 'اسأل النور...',
            reflecting: 'تأمل...',
          }
        },
      },
      es: {
        translation: {
          nav: {
            journey: 'La Experiencia',
            stories: 'Legado',
            guide: 'Guía Nur',
            about: 'Filosofía',
          },
          hero: {
            title: 'Descubre la Verdad Interior',
            subtitle: 'No eres una gota en el océano; eres el océano entero en una gota. Explora el entorno que vio nacer la luz final.',
            cta: 'Entrar a la Exhibición',
            scroll: 'Desciende a la reflexión',
          },
          journey: {
            chapter: 'Capítulo',
            reflect: 'Reflexiona',
            insight: 'Sumergir en el Conocimiento',
            proceed: 'Proceder con Sabiduría',
            understand: 'Comprendo',
            sharePrompt: 'Comparte tu reflexión con Nur',
            placeholder: '¿Qué agita tu corazón?',
            inquiry: 'Indagación Profunda',
            scenes: {
              chaos: 'La Era de las Sombras',
              mercy: 'Refinando el Alma',
              revelation: 'El Primer Susurro',
              liberation: 'Rompiendo Cadenas',
              destiny: 'El Retorno Infinito',
            },
            descriptions: {
              chaos: 'Imagina un mundo sin verdad objetiva. Donde la fuerza era la única ley y los débiles eran vendidos. Esto era la "Jahiliyyah": la oscuridad del alma.',
              mercy: 'Antes de ser Mensajero, era "Al-Amin" (El Confiable). Unificó corazones por el peso de su carácter, antes de que se pronunciara una sola palabra del Corán.',
              revelation: 'En el silencio del Monte Hira, los cielos hablaron. "¡Lee!" fue el comando. No por poder, sino para reconectar al creado con su Creador.',
              liberation: 'El Islam no solo cambió una religión; abolió la adoración de hombres. Declaró que ningún humano es superior a otro excepto por la pureza de su corazón.',
              destiny: 'Venimos del Infinito y al Infinito volvemos. La verdad no es algo que aprendes; es algo que recuerdas.',
            },
            questions: {
              chaos: 'Si no hay una ley superior, ¿qué detiene al poderoso de aplastar al débil?',
              mercy: '¿Puede un mensaje ser verdadero si el mensajero no es también hermoso en carácter?',
              revelation: '¿Por qué un hombre que lo tenía todo huiría a una cueva en busca de algo más alto?',
              liberation: '¿Eres realmente libre si eres esclavo de tus propios deseos o de las opiniones de los demás?',
              destiny: 'Si hoy fuera tu último atardecer, ¿cuál sería la firma de tu alma en este mundo?',
            }
          },
          guide: {
            title: 'Nur',
            subtitle: 'La Luz Susurrante',
            intro: '"Soy Nur. Tus preguntas son las chispas que iluminan el camino. Habla desde tu corazón."',
            input: 'Pregunta a la luz...',
            reflecting: 'Reflexionando...',
          }
        },
      },
    },
  });

export default i18n;
