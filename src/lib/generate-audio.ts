/**
 * Audio Generation Helper
 *
 * Since we can't generate real TTS audio in this build, the game uses
 * the Web Speech API as a fallback when MP3 files aren't available.
 *
 * For production, upload MP3 clips to Supabase Storage and update
 * the audioUrl in each language entry in audio-data.ts.
 *
 * Sample phrases for each language (used by Web Speech API fallback):
 */
export const samplePhrases: Record<string, { text: string; lang: string }> = {
  // ───────────────────────────────────────────────
  // Original 25 languages
  // ───────────────────────────────────────────────
  english: { text: "Hello! Welcome to our city. It's a beautiful day today, isn't it? I love walking through the park.", lang: "en-GB" },
  spanish: { text: "Hola! Bienvenidos a nuestra ciudad. Hace un dia muy bonito hoy. Me encanta pasear por el parque.", lang: "es-ES" },
  french: { text: "Bonjour! Bienvenue dans notre ville. Il fait tres beau aujourd'hui. J'adore me promener dans le parc.", lang: "fr-FR" },
  german: { text: "Hallo! Willkommen in unserer Stadt. Es ist ein wunderschoener Tag heute. Ich liebe es, durch den Park zu spazieren.", lang: "de-DE" },
  italian: { text: "Ciao! Benvenuti nella nostra citta. Oggi e una bella giornata. Mi piace passeggiare nel parco.", lang: "it-IT" },
  portuguese: { text: "Ola! Bem-vindos a nossa cidade. Hoje esta um dia lindo. Eu adoro caminhar pelo parque.", lang: "pt-BR" },
  russian: { text: "Zdravstvuyte! Dobro pozhalovat v nash gorod. Segodnya prekrasnyy den. Ya lyublyu gulyat po parku.", lang: "ru-RU" },
  japanese: { text: "Konnichiwa! Watashitachi no machi e yokoso. Kyou wa totemo ii tenki desu ne. Kouen wo sanpo suru no ga suki desu.", lang: "ja-JP" },
  korean: { text: "Annyeonghaseyo! Uri dosi-e osin geoseul hwangyeong hamnida. Oneul nalssiga jeongmal johneyo.", lang: "ko-KR" },
  mandarin: { text: "Ni hao! Huanying lai dao women de chengshi. Jintian tianqi zhen hao. Wo xihuan zai gongyuan li sanbu.", lang: "zh-CN" },
  hindi: { text: "Namaste! Hamare shahar mein aapka swaagat hai. Aaj bahut accha din hai. Mujhe park mein ghoomna bahut pasand hai.", lang: "hi-IN" },
  arabic: { text: "Marhaba! Ahlan wa sahlan fi madinatina. Al yawm jaww jameel jiddan. Uhibbu al mashee fi al hadeeqa.", lang: "ar-SA" },
  turkish: { text: "Merhaba! Sehrimize hos geldiniz. Bugun hava cok guzel. Parkta yuruyus yapmayi cok seviyorum.", lang: "tr-TR" },
  thai: { text: "Sawadee krap! Yindee tonrap su muang khong rao. Wan nee akat dee mak. Phom chop dern len nai suan.", lang: "th-TH" },
  vietnamese: { text: "Xin chao! Chao mung den thanh pho cua chung toi. Hom nay troi dep qua. Toi rat thich di dao trong cong vien.", lang: "vi-VN" },
  swahili: { text: "Habari! Karibu katika jiji letu. Leo ni siku nzuri sana. Ninapenda kutembea bustanini.", lang: "sw" },
  dutch: { text: "Hallo! Welkom in onze stad. Het is vandaag een prachtige dag. Ik hou ervan om in het park te wandelen.", lang: "nl-NL" },
  polish: { text: "Czesc! Witamy w naszym miescie. Dzisiaj jest piekny dzien. Uwielbiam spacerować po parku.", lang: "pl-PL" },
  greek: { text: "Geia sas! Kalos irthate stin poli mas. Simera einai mia omorfi mera. Mou aresei na perpato sto parko.", lang: "el-GR" },
  hebrew: { text: "Shalom! Bruchim habaim la'ir shelanu. Hayom yom yafe meod. Ani ohev letayel bapark.", lang: "he-IL" },
  tamil: { text: "Vanakkam! Engal nagarukkuh varavergiren. Inru mikavum azhagana naal. Poongavil nadappadhu enakkuh migavum pidikkum.", lang: "ta-IN" },
  yoruba: { text: "Bawo ni! E kaabo si ilu wa. Ojo oni dara pupo. Mo nifee rin ninu ogba itura.", lang: "yo" },
  indonesian: { text: "Halo! Selamat datang di kota kami. Hari ini cuacanya sangat bagus. Saya suka berjalan di taman.", lang: "id-ID" },
  swedish: { text: "Hej! Valkommen till var stad. Det ar en vacker dag idag. Jag alskar att promenera i parken.", lang: "sv-SE" },
  amharic: { text: "Selam! Wede ketamachin enqwan dehna metachihu. Zare betam konjo ken new. Park wist mehedun ewedewalew.", lang: "am" },

  // ───────────────────────────────────────────────
  // European languages
  // ───────────────────────────────────────────────
  romanian: { text: "Buna ziua! Bine ati venit in orasul nostru. Astazi este o zi frumoasa. Imi place sa ma plimb prin parc.", lang: "ro-RO" },
  danish: { text: "Hej! Velkommen til vores by. Det er en smuk dag i dag. Jeg elsker at gaa en tur i parken.", lang: "da-DK" },
  norwegian: { text: "Hei! Velkommen til byen vaar. Det er en vakker dag i dag. Jeg elsker aa gaa tur i parken.", lang: "nb-NO" },
  finnish: { text: "Hei! Tervetuloa kaupunkiimme. Tanaan on kaunis paiva. Rakastan kavella puistossa.", lang: "fi-FI" },
  czech: { text: "Ahoj! Vitejte v nasem meste. Dnes je krasny den. Miluji prochazky v parku.", lang: "cs-CZ" },
  hungarian: { text: "Szia! Udvozoljuk a varosunkban. Ma gyonyoru nap van. Szeretek setalni a parkban.", lang: "hu-HU" },
  catalan: { text: "Hola! Benvinguts a la nostra ciutat. Avui fa un dia molt bonic. M'encanta passejar pel parc.", lang: "ca-ES" },
  galician: { text: "Ola! Benvidos a nosa cidade. Hoxe fai un dia moi bonito. Encantame pasear polo parque.", lang: "gl-ES" },
  slovak: { text: "Ahoj! Vitajte v nasom meste. Dnes je krasny den. Milujem prechadzky v parku.", lang: "sk-SK" },
  bulgarian: { text: "Zdraveyte! Dobre doshli v nashiya grad. Dnes e prekrasen den. Obicham da se razkhozdam v parka.", lang: "bg-BG" },
  serbian: { text: "Zdravo! Dobro dosli u nas grad. Danas je predivan dan. Volim da setam po parku.", lang: "sr-RS" },
  croatian: { text: "Bok! Dobro dosli u nas grad. Danas je prekrasan dan. Volim setati parkom.", lang: "hr-HR" },
  bosnian: { text: "Zdravo! Dobro dosli u nas grad. Danas je prekrasan dan. Volim setati parkom.", lang: "bs-BA" },
  slovenian: { text: "Zdravo! Dobrodosli v nasem mestu. Danes je lep dan. Rad se sprehajam po parku.", lang: "sl-SI" },
  lithuanian: { text: "Sveiki! Sveiki atvyke i musu miesta. Siandien grazi diena. Man patinka vaikscioti parke.", lang: "lt-LT" },
  latvian: { text: "Sveiki! Laipni ludzam musu pilseta. Sodien ir skaista diena. Man patik pastaigaties parka.", lang: "lv-LV" },
  estonian: { text: "Tere! Tere tulemast meie linna. Tana on ilus paev. Mulle meeldib pargis jalutada.", lang: "et-EE" },
  albanian: { text: "Pershendetje! Mire se vini ne qytetin tone. Sot eshte nje dite e bukur. Me pelqen te shetis ne park.", lang: "sq-AL" },
  macedonian: { text: "Zdravo! Dobre dojdovte vo nashiot grad. Denes e prekrasen den. Sakam da se razoduvam vo parkot.", lang: "mk-MK" },
  ukrainian: { text: "Pryvit! Laskavo prosymo do nashoho mista. Sohodni chudovyy den. Ya lyublyu hulyaty v parku.", lang: "uk-UA" },
  belarusian: { text: "Pryvitanne! Sapraudi laskava zaprashaem u nash horad. Siodnia cudouny dzen. Ya lyublyu hulyats u parku.", lang: "be-BY" },
  icelandic: { text: "Hallo! Velkomin til borgarinnar okkar. I dag er fallegu dagur. Mer finnst gaman ad labba um gardinn.", lang: "is-IS" },
  maltese: { text: "Merhba! Merhba fil-belt taghna. Illum huwa jum sabih hafna. Inhobb nimxi fil-park.", lang: "mt-MT" },
  luxembourgish: { text: "Moien! Wëllkomm an eiser Stad. Haut ass e schéinen Dag. Ech ginn gäre am Park spadséieren.", lang: "lb-LU" },
  welsh: { text: "Shwmae! Croeso i'n dinas ni. Mae'n ddiwrnod hyfryd heddiw. Rwy'n mwynhau cerdded yn y parc.", lang: "cy-GB" },
  irish: { text: "Dia duit! Failte go dti ar gcathair. Is la alainn e inniu. Is breá liom siúl sa pháirc.", lang: "ga-IE" },
  scottishGaelic: { text: "Halò! Fàilte gu ar baile mòr. Tha latha brèagha ann an-diugh. Is toigh leam coiseachd anns a' phàirc.", lang: "gd-GB" },
  basque: { text: "Kaixo! Ongi etorri gure hirira. Gaur egun ederra da. Parkean paseatzea gustatzen zait.", lang: "eu-ES" },
  corsican: { text: "Bonghjornu! Benvenuti in a nostra cita. Oghje hè una bella ghjurnata. Mi piace passighjà in u parcu.", lang: "co-FR" },
  yiddish: { text: "Sholem aleykhem! Vilkumen in undzer shtot. Haynt iz a sheyner tog. Ikh hob lib shpatsirn in park.", lang: "yi" },

  // ───────────────────────────────────────────────
  // Caucasus & Central Asia
  // ───────────────────────────────────────────────
  georgian: { text: "Gamarjoba! Ketili iqos tkvenni chvens kalakshi. Dghes dzalian lamazi dghea. Me mikvars parkshi seirnoba.", lang: "ka-GE" },
  armenian: { text: "Barev dzez! Bari galust mer kaghak. Aysor shat geghetsik or e. Yes sirum em zbosnel aygestanum.", lang: "hy-AM" },
  azerbaijani: { text: "Salam! Sheherimize xosh gelmisiniz. Bu gun hava chox gozeldir. Men parkda gez meyi chox sevirem.", lang: "az-AZ" },
  kazakh: { text: "Salem! Bizdyn kalaga kosh keldiniz. Bugin ote adem kun. Men sayabakta serueyldy jaqsy koremin.", lang: "kk-KZ" },
  uzbek: { text: "Salom! Shahrimizga xush kelibsiz. Bugun juda chiroyli kun. Men bogda sayr qilishni yaxshi koraman.", lang: "uz-UZ" },
  kyrgyz: { text: "Salam! Bizdyn shaarga kosh kelipsiz. Bugun abdan sonduu kun. Men parkta seruuloduu jakshynarmen.", lang: "ky-KG" },
  tajik: { text: "Salom! Xush omadad ba shahri mo. Imruz ruzi zebo ast. Man dar park gardish kardanro dust doram.", lang: "tg-TJ" },
  persian: { text: "Salam! Be shahre ma khosh amadid. Emruz rooze zibayist. Man aasheghe ghadam zadan dar park hastam.", lang: "fa-IR" },
  pashto: { text: "Salam! Zamoong khaar ta pe khair raghley. Nan wradz dera khkulay da. Ma ta da park ke garzedal khwakhegi.", lang: "ps-AF" },
  kurdish: { text: "Slav! Bi xer hatin bajare me. Iro rojek xweş e. Ez hez dikim li parkê bigerin.", lang: "ku" },
  turkmen: { text: "Salam! Biziň şäherimize hoş geldiňiz. Bu gün howa örän gözel. Men seýilgähde gezmegi gowy görýärin.", lang: "tk-TM" },
  mongolian: { text: "Sain baina uu! Manai hotod tavtai moril. Onooder ene udur ikh goyo baina. Bi tsetserlegt alkhakh durtai.", lang: "mn-MN" },

  // ───────────────────────────────────────────────
  // South Asian languages
  // ───────────────────────────────────────────────
  urdu: { text: "Assalam o alaikum! Hamare sheher mein khush aamdeed. Aaj bohat khoobsurat din hai. Mujhe park mein sair karna pasand hai.", lang: "ur-PK" },
  bengali: { text: "Nomoskar! Amader shohore swagatam. Aaj khub shundor din. Ami parke hnatate khub bhalobassi.", lang: "bn-BD" },
  punjabi: { text: "Sat sri akaal! Sade shehar vich tuhadda swaagat hai. Ajj bahut sohna din hai. Mainu park vich ghoomna bahut pasand hai.", lang: "pa-IN" },
  gujarati: { text: "Namaste! Amara shahermaa aapnu swagatam chhe. Aaje bahuj sundar divas chhe. Mane parkmaa farva bahuj gamay chhe.", lang: "gu-IN" },
  marathi: { text: "Namaskar! Aamchya shaharaat tumcha swaagat aahe. Aaj khup sundar diwas aahe. Mala parkmadhe phirayla khup aavadte.", lang: "mr-IN" },
  telugu: { text: "Namaskaram! Ma nagaram ki swaagatham. Ee roju chala andamaina roju. Naaku parkulo nadavatam chala ishtam.", lang: "te-IN" },
  kannada: { text: "Namaskara! Namma nagarakke swaagata. Ivattu tumbaa sundaravaada dina. Nanage parkalli nadeyuvudu tumbaa ishta.", lang: "kn-IN" },
  malayalam: { text: "Namaskkaram! Nammude nagarathilekku swagatham. Innu valare sundara divasam aanu. Enikku parkil nadakkaan valare ishtamaanu.", lang: "ml-IN" },
  sinhala: { text: "Ayubowan! Apey nagarayata saadarayen piligannava. Ada harima lassana dawasak. Mata udyanaye sanchaaranaya kireema godak kamathi.", lang: "si-LK" },
  nepali: { text: "Namaste! Hamro sahar maa tapaailai swaagat chha. Aaja dherai ramro din chha. Malai park maa hidna dherai man parchha.", lang: "ne-NP" },

  // ───────────────────────────────────────────────
  // Southeast Asian languages
  // ───────────────────────────────────────────────
  burmese: { text: "Mingalaba! Kyundaw doh myoh thoh ko kyaw kyaw soh la bar. Di nay kha yee kaung bar deh. Park hma lan shout tah ko kyite par deh.", lang: "my-MM" },
  lao: { text: "Sabaidee! Nyindee tonhap sou muang khong hao. Meu nee aakat dee lai. Khoy mak nyaang len nai souan.", lang: "lo-LA" },
  khmer: { text: "Suosdey! Som svakom mok kaan tee krong robos yeung. Thngay nih akat laor nas. Khnhom chol chet daer leng khnong suan chbaa.", lang: "km-KH" },
  malay: { text: "Selamat datang! Selamat datang ke bandar kami. Hari ini cuaca sangat cantik. Saya suka berjalan di taman.", lang: "ms-MY" },
  tagalog: { text: "Kamusta! Maligayang pagdating sa aming lungsod. Magandang araw ngayon. Gustong-gusto kong maglakad sa parke.", lang: "tl-PH" },
  cebuano: { text: "Kumusta! Maayong pag-abot sa among siyudad. Nindot kaayo ang panahon karon. Ganahan kaayo ko maglakaw sa parke.", lang: "ceb" },
  javanese: { text: "Sugeng rawuh! Sugeng rawuh ing kutha kita. Dina iki cuacane apik banget. Kula remen mlampah-mlampah ing taman.", lang: "jv-ID" },
  hmong: { text: "Nyob zoo! Zoo siab txais tos rau peb lub nroog. Hnub no huab cua zoo heev. Kuv nyiam taug kev hauv lub tiaj ua si.", lang: "hmn" },

  // ───────────────────────────────────────────────
  // African languages
  // ───────────────────────────────────────────────
  afrikaans: { text: "Hallo! Welkom in ons stad. Dit is vandag 'n pragtige dag. Ek hou daarvan om in die park te stap.", lang: "af-ZA" },
  zulu: { text: "Sawubona! Siyakwamukela edolobheni lethu. Namhlanje usuku oluhle kakhulu. Ngiyathanda ukuhamba epaki.", lang: "zu-ZA" },
  xhosa: { text: "Molo! Wamkelekile kwisixeko sethu. Namhlanje yimini entle kakhulu. Ndiyathanda ukuhamba epakini.", lang: "xh-ZA" },
  sotho: { text: "Dumela! O amohetswe toropong ya rona. Kajeno ke letsatsi le letle haholo. Ke rata ho tsamaya parkeng.", lang: "st-ZA" },
  igbo: { text: "Nnoo! Nabata na obodo anyi. Taa bu ubochi mara mma. Anam acho ije njem na ogige.", lang: "ig-NG" },
  hausa: { text: "Sannu! Barka da zuwa garinmu. Yau rana mai kyau ce. Ina son yawo a cikin lambun shakatawa.", lang: "ha-NG" },
  somali: { text: "Salaan! Ku soo dhawoow magaaladayada. Maanta waa maalin qurux badan. Waxaan jeclahay inaan ku socon beerta.", lang: "so-SO" },
  oromo: { text: "Akkam! Baga gara magaalaa keenyatti dhuftan. Har'a guyyaan bareedu dha. Ani paarkii keessa deemuu nan jaaladha.", lang: "om-ET" },
  tigrinya: { text: "Selam! Nab ketamana bdehan metstikum. Lomali tsebukti meaelti eya. Ana ab parki mistengagsal yefetweani.", lang: "ti-ER" },
  malagasy: { text: "Manao ahoana! Tongasoa eto amin'ny tanananay. Andro tsara tokoa androany. Tiako ny mandeha any amin'ny zaridaina.", lang: "mg-MG" },
  kinyarwanda: { text: "Muraho! Murakaza neza mu mugi wacu. Uyu munsi ni umunsi mwiza cyane. Nkunda gutembera mu busitani.", lang: "rw-RW" },
  lingala: { text: "Mbote! Boyei malamu na engumba na biso. Lelo ezali mokolo moko kitoko mingi. Nalingaka kotambola na parc.", lang: "ln-CD" },
  wolof: { text: "Nanga def! Dalal jamm ci sunu dëkk bi. Tey moo neex lool. Damay bëgg dox ci biir parc bi.", lang: "wo-SN" },
  tswana: { text: "Dumela! O amogetswe mo toropong ya rona. Gompieno ke letsatsi le lentle thata. Ke rata go tsamaya mo phakeng.", lang: "tn-ZA" },
  shona: { text: "Mhoro! Mauya kutaundi redu. Nhasi zuva rakanaka chaizvo. Ndinoda kufamba mupaki.", lang: "sn-ZW" },

  // ───────────────────────────────────────────────
  // Americas & Pacific
  // ───────────────────────────────────────────────
  haitianCreole: { text: "Bonjou! Byenveni nan vil nou an. Jodi a se yon bel jou. Mwen renmen mache nan pak la.", lang: "ht-HT" },
  quechua: { text: "Allianchu! Hamuykamuy llaqtaykuman. Kunan punchaw sumaq punchawmi. Parquepi puriyta munani.", lang: "qu-PE" },
  guarani: { text: "Mba'eichapa! Tereguahê porãite ore táva-pe. Ko ára iporãiterei. Che avy'a aguata parke-pe.", lang: "gn-PY" },
  hawaiian: { text: "Aloha! E komo mai i ko makou kulanakauhale. He la nani keia la. Makemake au e hele ma ka paka.", lang: "haw" },
  maori: { text: "Kia ora! Nau mai haere mai ki to matou taone. He ra ataahua tenei ra. He pai ki au te hikoi i te papa rekreation.", lang: "mi-NZ" },
  samoan: { text: "Talofa! Afio mai i lo matou aai. O le aso lenei e matagofie tele. Ou te fiafia e savalivali i le paka.", lang: "sm-WS" },
  tongan: { text: "Malo e lelei! Talitali fiefia ki he matou kolo. Ko e aho ni ko ha aho fakahoifua. Oku ou sai'ia he eveeve he paaka.", lang: "to-TO" },
  fijian: { text: "Bula! Ni sa moce mai ki na neitou koro. E dua na siga totoka sara edaidai. Au domoni na savarevare ena paki.", lang: "fj-FJ" },

  // ───────────────────────────────────────────────
  // Constructed & Other
  // ───────────────────────────────────────────────
  esperanto: { text: "Saluton! Bonvenon al nia urbo. Hodiau estas bela tago. Mi amas promeni en la parko.", lang: "eo" },
  scots: { text: "Hullo! Walcome tae oor ceity. It's a bonnie day the day. Ah love walkin through the park.", lang: "sco" },
};
