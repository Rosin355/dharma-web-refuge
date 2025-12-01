
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useTempleCarouselImages, useMasterImages } from '@/hooks/useTempleImages';
import { usePageContent } from '@/hooks/usePageContent';

const ChiSiamo = () => {
  const { carouselImages, loading: carouselLoading } = useTempleCarouselImages();
  const { masterImages, loading: masterLoading } = useMasterImages();
  const { getContent, loading: contentLoading } = usePageContent('chi-siamo');

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-zen-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento contenuti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-zen-stone to-zen-sage py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-light mb-4">
            <span className="text-saffron-600">{getContent('header-title', 'Chi Siamo')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getContent('header-subtitle', 'La Comunità Bodhidharma - Tempio Musang Am (Eremo della Non Forma) di Lerici, dove risiediamo e impartiamo l\'insegnamento buddhista')}
          </p>
        </div>
      </section>

      {/* Maestri e Guide Spirituali */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-light text-center mb-12">
            {getContent('maestri-title', 'I Nostri').replace(' Maestri', '')} <span className="text-saffron-500">Maestri</span>
          </h2>

          {/* Taehye sunim */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-1 aspect-square lg:aspect-auto">
                    {masterLoading ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-500">Caricamento...</span>
                      </div>
                    ) : (
                      <img 
                        src={masterImages.find(img => img.alt_text?.toLowerCase().includes('taehye'))?.storage_url || 
                             "https://images.unsplash.com/photo-1591123720462-0dd9ee0ee2fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt="Taehye sunim"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <h3 className="font-serif text-3xl font-light mb-2">
                      <span className="text-saffron-600">Taehye sunim</span> 大慧스님 / Mahapañña
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">Nome monastico Taehye sunim, nato a Mikkeli, in Finlandia nel 1952</p>
                    
                    <div className="space-y-4 text-sm leading-relaxed">
                      <div>
                        <strong>1978</strong> - Laureatosi in lettere ha svolto in seguito lavori e ricerca all'interno dell'università di Helsinki. Ha tradotto testi buddhisti e scritto articoli di vario genere su riviste specialistiche. Sono più di dieci i suoi libri pubblicati in Finlandia.
                      </div>
                      <div>
                        <strong>1982</strong> - Viene ordinato monaco novizio in Thailandia dal Maestro Phra Krusangvorn Samadhivat presso il monastero Wat Pleng Vipassana e prende il nome monastico Mahapañña (Maha=grande; pañña=saggezza).
                      </div>
                      <div>
                        <strong>1987</strong> - Riceve in Corea del sud l'ordinazione completa di bhikshu dal Maestro Il Gak 一覺, secondo la tradizione Seon 禪, e prende il nome monastico Taehye (Tae 大 = Grande; Hye 慧 = Saggezza).
                      </div>
                      <div>
                        <strong>1992</strong> - Giunto in Italia ha iniziato a svolgere la sua attività presso il tempio "Pagoda", un piccolo eremo buddhista sito in località Pieve a Socana di Castel Focognano (AR).
                      </div>
                      <div>
                        <strong>1999</strong> - In Birmania riceve la riordinazione di bhikkhu secondo la scuola Theravada dal Maestro U Paññadipa, abate del International Meditation Center di Yangon.
                      </div>
                      <div>
                        <strong>2000</strong> - Lascia la "Pagoda" e fonda il Tempio Musang Am (Eremo della Non Forma) in località Monti San Lorenzo di Lerici(SP), dove tuttora risiede ed impartisce l'insegnamento buddhista.
                      </div>
                      
                      <div className="bg-saffron-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold mb-2">OGGI</h4>
                        <p>
                          Taehye sunim è presidente, dal 1997, dell'Associazione Culturale "Comunità Bodhidharma" ed inoltre guida spirituale dell'omonima associazione "Bodhidharma" in Finlandia. È impegnato in diverse attività di Dharma e insegnamento delle pratiche di meditazione al Tempio Musang Am 無相庵 di Lerici (SP) ed a Genova. Dal 05/15 è ufficialmente Ministro di Culto dell'Unione Buddhista Italiana.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Taeri sunim */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-1 aspect-square lg:aspect-auto">
                    {masterLoading ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-500">Caricamento...</span>
                      </div>
                    ) : (
                      <img 
                        src={masterImages.find(img => img.alt_text?.toLowerCase().includes('taeri'))?.storage_url || 
                             "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt="Taeri sunim"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <h3 className="font-serif text-3xl font-light mb-2">
                      <span className="text-saffron-600">Taeri sunim</span> 太利스님 / Kumara
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">Nome monastico Taeri sunim, nato a Cittadella(PD), Italia nel 1968</p>
                    
                    <div className="space-y-3 text-sm leading-relaxed">
                      <div><strong>1993-1994</strong> - Postulante alla Pagoda di Arezzo sotto la guida del Maestro Taehye Sunim (tradizione coreana).</div>
                      <div><strong>1994</strong> - Maggio-settembre: ritiro estivo di meditazione a Taiwan sotto la guida del Maestro Ziyuan 自圓. Novembre: al Songgwangsa 松廣 in Corea del Sud. diventa discepolo del Maestro Ilgak 一覺 secondo la tradizione Seon 禪.</div>
                      <div><strong>1995</strong> - Febbraio: ordinazione (individuale) di bhikshu (monaco) al Songwangsa davanti all'assemblea di 10 Maestri e prende il nome monastico Taeri (Tae 太=Grande; Ri 利=Beneficio).</div>
                      <div><strong>1996</strong> - Aprile: ordinazione di novizio nell'Ordine Chogye 曹溪宗 al Chikjisa 直指寺 in Corea del Sud. Ottobre: Ordinazione monastica e di bodhisattva nell'Ordine Chogye al Tongdosa通度寺 in Corea del Sud.</div>
                      <div><strong>1994-1997</strong> - Ritiri di meditazione invernali ed estivi di tre mesi al Songgwangsa 松廣寺 in Corea del Sud. Durante i mesi liberi studio della lingua coreana.</div>
                      <div><strong>1997-1999</strong> - Soggiorno in Thailandia e Myanmar nei monasteri della tradizione Theravada, ordinazione monastica (upasampadā) e prende il nome monastico Kumara (giovane). Seguono studi della dottrina, meditazione sotto la guida del Maestro Paññadipa. Visite prolungate in Sri Lanka nei luoghi sacri e studio.</div>
                      <div><strong>1999-2001</strong> - Soggiorno a Taiwan nei monasteri della tradizione cinese Mahayana, ordinazione monastica e di bodhisattva, ritiri di meditazione, recitazioni di sutra e cerimonie, apprendimento della lingua cinese di base.</div>
                      <div><strong>2004</strong> - "Diploma in Buddhism" conseguito al Pali & Buddhist University of Colombo Sri Lanka.</div>
                      <div><strong>2011</strong> - Laurea in Scienze dell'Educazione e della Formazione, Università degli Studi di Padova.</div>
                      <div><strong>2013</strong> - Laurea magistrale in Scienze Umane e Pedagogiche, Università degli studi di Padova.</div>
                      
                      <div className="bg-saffron-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold mb-2">OGGI</h4>
                        <p>
                          Taeri sunim è attualmente impegnato in diverse attività di Dharma e insegnamento delle pratiche di meditazione a Padova, al monastero Musang Am無相庵 di Lerici (SP) e in collaborazione con vari centri della tradizione Theravada dello Sri Lanka presenti in Italia e della Pagoda vietnamita, Chùa Viên Ý, di Polverara (PD). Dal 2018 è ufficialmente Ministro di Culto dell'Unione Buddhista Italiana.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ven. Kusalananda */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-1 aspect-square lg:aspect-auto">
                    {masterLoading ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-500">Caricamento...</span>
                      </div>
                    ) : (
                      <img 
                        src={masterImages.find(img => img.alt_text?.toLowerCase().includes('kusalananda'))?.storage_url || 
                             "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt="Ven. Kusalananda"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <h3 className="font-serif text-3xl font-light mb-2">
                      <span className="text-saffron-600">Ven. Kusalananda</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">Nome monastico Kusalananda, nato a Genova, in Italia nel 1964</p>
                    
                    <div className="space-y-4 text-sm leading-relaxed">
                      <p>
                        Dopo un percorso spirituale di preparazione passato al tempio Musang am di Lerici sotto la guida del <strong>Maestro Tae Hye sunim</strong> in qualità di upasaka, decide di "lasciare casa" prendendo i precetti da anagarika.
                      </p>
                      <p>
                        A seguire un ritiro di sei mesi in Birmania presso il centro <strong>Shwee Oo Min</strong>, con il Maestro di meditazione vipassana <strong>Ashin-Tejaniya</strong> dove viene ordinato Bikkhu, nella tradizione Theravada birmana.
                      </p>
                      <p>
                        Risiede attualmente al <strong>Tempio Musang am di Lerici</strong> presso Comunità Bodhidharma, ed ha contatti con realtà associative legate al mondo del volontariato, come l'Associazione <strong>Karuna onlus di Genova</strong>, di cui è segretario.
                      </p>
                      <p>
                        Ha svolto per anni attività di volontario nell'ambito del progetto <strong>Liberation prison project</strong> di Milano, portando la meditazione ai detenuti del penitenziario di Massa-Carrara e talvolta altri penitenziari, es La-Spezia-Migliarina e Bollate.
                      </p>
                      <p>
                        È dal 2009 in contatto collaborativo con il Tempio srilankese Sambudu di Genova di cui è promotore - segretario.
                      </p>
                      <p>
                        Attivo come traduttore, organizzatore di eventi di Dharma e insegnante di meditazione, collega spesso gruppi eterogenei di persone quali escursionisti, praticanti di yoga, musicisti, per diffondere il Dharma in "esterna" negli ambiti più disparati.
                      </p>
                      <p>
                        Musicista, pianista e compositore, sviluppa attività di raccordo tra arte, creatività e meditazione spesso in collaborazione con altri musicisti e poeti.
                      </p>
                      <p>
                        Dal 2018 è ufficialmente Ministro di Culto dell'Unione Buddhista Italiana.
                      </p>
                      <p>
                        Dal 2019 attivo nel progetto "Respirando" presso ISTITUTO COMPRENSIVO ARCOLA/AMEGLIA nell'ambito della scuola primaria, proponendo tra l'altro, giochi concentrativi rivolti al singolo, giochi di gruppo, esercizi di respirazione consapevole, circle time, interazione amichevole, dialogo, pratica della "gentilezza".
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* La Comunità */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-light text-center mb-12">
            {getContent('comunita-title', 'La').replace(' Comunità', '')} <span className="text-saffron-500">Comunità</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-serif text-2xl font-light mb-6">Storia della Comunità Bodhidharma</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  L'attività di Taehye sunim in Italia è cominciata nel 1992 alla Pagoda di Rassina (AR). Dopo la morte dell'ing. Martinelli, proprietario della Pagoda, nel 1996 Taehye sunim ha cominciato a cercare un luogo più adatto alla pratica. Nel 1997 è stata fondata l'associazione culturale "Comunità Bodhidharma". Dal 2000 la sede dell'associazione è nel centro monastico Musang Am a Lerici (SP).
                </p>
                <p>
                  L'attività della Comunità Bodhidharma si ispira alla tradizione Buddhista dell'Ordine Chogye coreano, ma nell'insegnamento ci sono influenze anche della scuola theravada e della tradizione cinese. L'Associazione sostiene il centro monastico Musang Am che organizza studi del Buddhadharma e ritiri meditativi.
                </p>
                <p>
                  Sono stati avviati gruppi buddhisti di pratica e meditazione Seon (Zen) a Lerici, Genova, Padova e Bosentino.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-light mb-6">Attività e Tradizione</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  La nostra comunità mantiene viva la tradizione buddhista attraverso diverse attività:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Studi del Buddhadharma e approfondimenti sui sutra</li>
                  <li>Ritiri meditativi nella tradizione Seon (Zen)</li>
                  <li>Cerimonie e recitazioni tradizionali</li>
                  <li>Insegnamenti dei Grandi Maestri</li>
                  <li>Gruppi di pratica e meditazione</li>
                </ul>
                <p>
                  La nostra pratica integra elementi della tradizione Chogye coreana, della scuola Theravada e della tradizione cinese, offrendo un percorso completo e autentico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Il Tempio - Carosello Immagini */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-light text-center mb-12">
            {getContent('tempio-title', 'Il').replace(' Tempio', '')} <span className="text-saffron-500">Tempio</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tempio Musang Am (Eremo della Non Forma) - Monti San Lorenzo, Lerici (SP)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carouselLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <span className="text-gray-500">Caricamento...</span>
                  </div>
                </div>
              ))
            ) : carouselImages.length > 0 ? (
              carouselImages.map((image, index) => (
                <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={image.storage_url}
                    alt={image.alt_text || `Immagine del tempio ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))
            ) : (
              [
                { src: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Sala di meditazione" },
                { src: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Esterno del tempio" },
                { src: "https://images.unsplash.com/photo-1591123720462-0dd9ee0ee2fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Giardino zen" },
                { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Sala dharma" },
                { src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Statua del Buddha" },
                { src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Panorama dai monti" }
              ].map((fallbackImage, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={fallbackImage.src}
                    alt={fallbackImage.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pratica di Dana e Sostegno */}
      <section className="py-16 bg-saffron-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-light text-center mb-8">
              {getContent('dana-title', 'Pratica di')} <span className="text-saffron-600">Dana</span>
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Dana significa "generosità, disponibilità"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">Sostegno Materiale</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Alimenti salutari:</h4>
                      <ul className="text-muted-foreground space-y-1 ml-4">
                        <li>• Cereali integrali, legumi biologici</li>
                        <li>• Verdure fresche (patate, carote, cipolle, zucchine)</li>
                        <li>• Frutta fresca (banane, mele, arance)</li>
                        <li>• Succhi senza zucchero aggiunto</li>
                        <li>• Latte di soia/mandorla</li>
                        <li>• Gallette di mais, kamut o farro</li>
                        <li>• Pane integrale o di segale</li>
                        <li>• Frutta secca (arachidi, pistacchi, mandorle)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-4">Sostegno Attraverso il Lavoro</h3>
                  <p className="text-muted-foreground mb-4">
                    Dana non significa esclusivamente donare cose materiali, ma i praticanti possono aiutare anche attraverso il proprio lavoro:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lavori da elettricista</li>
                    <li>• Lavori da muratore</li>
                    <li>• Lavori da idraulico</li>
                    <li>• Lavori da falegname</li>
                    <li>• Lavori di giardinaggio</li>
                    <li>• Lavori di sartoria</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section className="py-16 bg-zen-sage">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light mb-8 text-white">
            Tempio Musang Am
          </h2>
          <div className="flex flex-col items-center space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Monti San Lorenzo, 26 - 19032 Lerici (SP)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;
