import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import TravelMap from '@/shared/components/TravelMap';
import { AnimatedTitle } from '@/shared/components/ui/animated-title';

export const revalidate = 3600;

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('author');

  const projects = t.raw('projects') as Array<{
    title: string;
    image: string;
    url: string;
  }>;

  const timeline = t.raw('timeline') as {
    title: string;
    events: Array<{
      year: string;
      label: string;
      image: string;
      description: string;
      align: 'left' | 'right';
    }>;
  };

  const amapKey = t('travelMap.amapKey');
  const amapSecurityKey = t('travelMap.amapSecurityKey');
  const currentLocationLabel = t('travelMap.currentLocationLabel');
  const locations = t.raw('travelMap.locations') as Array<{
    name: string;
    lng: number;
    lat: number;
    description: string;
    isCurrent?: boolean;
  }>;

  return (
    <main className="overflow-x-hidden">
      <div className="min-h-screen">
        {/* Projects Section - Mobile */}
        <div className="block md:hidden">
          <section className="py-8 px-4">
            <div className="max-w-7xl mx-auto mt-8 md:mt-0">
              <div className="text-center mb-6">
                <AnimatedTitle className="text-xl font-light tracking-widest text-gray-100 mb-3">
                  {t('title')}
                </AnimatedTitle>
                <div className="w-12 h-px mx-auto mb-3"></div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="project-card p-[16px] bg-primary-foreground relative z-[1] flex h-full flex-col rounded-[24px] ease-[cubic-bezier(0.87,0,0.13,1)] hover:translate-y-[-2px] transition-transform duration-300 shadow-lg hover:shadow-2xl border border-gray-600"
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer h-full flex flex-col group"
                      title={`View "${project.title}" Project`}
                      href={project.url}
                    >
                      <div className="aspect-[1.675/1]">
                        <Image
                          alt={project.title}
                          loading="lazy"
                          width={400}
                          height={240}
                          className="aspect-[1.675/1] rounded-[4px] object-cover object-top w-full"
                          src={project.image}
                        />
                      </div>
                      <div className="h-max mt-4">
                        <div className="rich-text">
                          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Travel Map Section - Mobile */}
          <section className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-6">
                <AnimatedTitle className="text-xl font-light tracking-widest text-gray-100 mb-4">
                  {t('travelMap.title')}
                </AnimatedTitle>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-2 backdrop-blur-sm border border-gray-700">
                <div className="w-full h-[300px]">
                  <TravelMap amapKey={amapKey} securityKey={amapSecurityKey} locations={locations} currentLocationLabel={currentLocationLabel} />
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section - Mobile */}
          <section className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <section className="relative py-8 px-2">
                <div className="max-w-6xl mx-auto relative">
                  {timeline.events.map((event, index) => (
                    <div key={index} className="relative mb-12 last:mb-0">
                      {event.align === 'left' ? (
                        <div className="flex flex-col gap-2 mb-4">
                          <h2 className="text-2xl leading-none tracking-tight">
                            {event.year}
                          </h2>
                          <div className="flex flex-col items-start">
                            <h3 className="text-xs tracking-widest uppercase">
                              {event.label}
                            </h3>
                            <div className="w-24 h-0.5 bg-gray-400 mt-1"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex flex-col items-start">
                            <h3 className="text-xs tracking-widest uppercase">
                              {event.label}
                            </h3>
                            <div className="w-24 h-0.5 bg-gray-400 mt-1"></div>
                          </div>
                          <h2 className="text-2xl leading-none tracking-tight">
                            {event.year}
                          </h2>
                        </div>
                      )}
                      <div className="flex flex-col gap-3 items-start">
                        <div className="flex-shrink-0">
                          <div className="relative w-20 h-20">
                            <div className="w-full h-full rounded-full overflow-hidden shadow-xl border-2 border-white">
                              <Image
                                alt={event.label}
                                loading="lazy"
                                width={80}
                                height={80}
                                className="w-full h-full object-fit"
                                src={event.image}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>

        {/* Desktop Version - Left Right Layout */}
        <div className="hidden md:flex">
          <div className="flex w-full">
            {/* Left Side - Timeline (30%) */}
            <section className="w-[40%] py-16 px-12">
              <div className="max-w-6xl mx-auto">
                <section className="relative py-20 px-6">
                  <div className="max-w-6xl mx-auto relative">
                    {timeline.events.map((event, index) => (
                      <div key={index} className="relative mb-20 last:mb-0">
                        <div className="flex flex-col gap-2 mb-6 md:mb-0 md:absolute md:flex-row md:gap-4 md:items-center md:left-1/2 md:top-0 md:transform md:-translate-x-1/2">
                          {event.align === 'right' && (
                            <div className="flex flex-col items-start md:items-end md:order-1">
                              <h3 className="text-xs md:text-sm tracking-widest uppercase">
                                {event.label}
                              </h3>
                              <div className="w-32 md:w-[200px] h-0.5 bg-gray-400 mt-1 md:mt-0 md:absolute md:bottom-0"></div>
                            </div>
                          )}
                          <h2 className={`text-3xl md:text-4xl leading-none tracking-tight ${event.align === 'right' ? 'md:order-2' : ''}`}>
                            {event.year}
                          </h2>
                          {event.align === 'left' && (
                            <div className="flex flex-col items-start">
                              <h3 className="text-xs md:text-sm tracking-widest uppercase">
                                {event.label}
                              </h3>
                              <div className="w-32 md:w-[200px] h-0.5 bg-gray-400 mt-1 md:mt-0 md:absolute md:bottom-0"></div>
                            </div>
                          )}
                        </div>
                        <div className={`flex flex-col md:flex-row gap-4 md:gap-8 items-start md:pt-16 ${event.align === 'right' ? 'md:flex-row-reverse md:justify-end' : 'md:justify-start'}`}>
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-24 md:w-32 md:h-32">
                              <div className="w-full h-full rounded-full overflow-hidden shadow-xl border-2 md:border-4 border-white">
                                <Image
                                  alt={event.label}
                                  loading="lazy"
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-fit"
                                  src={event.image}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={`flex-1 max-w-md text-left ${event.align === 'right' ? 'md:text-right' : 'md:text-left'}`}>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            {/* Right Side - Projects & Travel Map (70%) */}
            <div className="w-[60%]">
              <section className="py-20 px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                    <AnimatedTitle className="text-3xl md:text-4xl font-light tracking-widest text-gray-100 mb-4">
                      {t('title')}
                    </AnimatedTitle>
                    <div className="w-16 h-px mx-auto mb-4"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        className="project-card p-[16px] bg-primary-foreground relative z-[1] flex h-full flex-col rounded-[24px] ease-[cubic-bezier(0.87,0,0.13,1)] hover:translate-y-[-2px] transition-transform duration-300 shadow-lg hover:shadow-2xl border border-gray-600"
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer h-full flex flex-col group"
                          title={`View "${project.title}" Project`}
                          href={project.url}
                        >
                          <div className="aspect-[1.675/1]">
                            <Image
                              alt={project.title}
                              loading="lazy"
                              width={400}
                              height={240}
                              className="aspect-[1.675/1] rounded-[4px] object-cover object-top w-full"
                              src={project.image}
                            />
                          </div>
                          <div className="h-max mt-4">
                            <div className="rich-text">
                              <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Travel Map Section - Desktop */}
              <section className="py-12 px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <AnimatedTitle className="text-3xl md:text-4xl font-light tracking-widest text-gray-100 mb-4">
                      {t('travelMap.title')}
                    </AnimatedTitle>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
                    <div className="w-full h-[500px] md:h-[600px]">
                      <TravelMap amapKey={amapKey} securityKey={amapSecurityKey} locations={locations} currentLocationLabel={currentLocationLabel} />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
