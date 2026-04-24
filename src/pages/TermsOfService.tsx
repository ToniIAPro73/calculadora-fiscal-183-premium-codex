import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, Globe, Scale, ShieldAlert } from 'lucide-react';
import Header from '@/components/Header';
import { useI18n } from '@/contexts/i18nContext';

const contentByLanguage = {
  es: {
    title: 'Términos de Servicio · TaxNomad',
    updatedAt: 'Última actualización: 20 de abril de 2026',
    heading: 'Términos de Servicio',
    intro: 'Condiciones legales de uso del servicio TaxNomad. Léelas antes de realizar cualquier compra.',
    providerTitle: '1. Identificación del prestador del servicio',
    providerIntro:
      'En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:',
    providerList: [
      ['Titular', 'Antonio Ballesteros Alonso'],
      ['NIF', '08997554T'],
      ['Domicilio', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)'],
      ['Email de contacto', 'hola@regla183.com'],
      ['Sitio web', 'regla183.com'],
    ],
    purposeTitle: '2. Propósito del servicio y limitación de responsabilidad',
    purposeBody: [
      'TaxNomad es una herramienta de utilidad técnica diseñada para ayudar a los usuarios a calcular sus días de presencia física en España con fines informativos.',
      'El informe generado no constituye asesoramiento legal o fiscal oficial ni reemplaza la consulta con un asesor fiscal, abogado o gestor colegiado.',
      'La exactitud del resultado depende exclusivamente de los datos introducidos por el usuario.',
    ],
    salesTitle: '3. Política de venta y derecho de desistimiento',
    salesBody: [
      'El Informe Premium tiene un coste de 9,99 € (IVA incluido) y se entrega en formato PDF de forma inmediata tras confirmarse el pago.',
      'De conformidad con el artículo 16.m) de la Directiva 2011/83/UE y el art. 103.m) del Real Decreto Legislativo 1/2007, el derecho de desistimiento no es aplicable a contenidos digitales suministrados en soporte no material una vez iniciada su ejecución con consentimiento expreso.',
    ],
    salesList: [
      'La ejecución ha comenzado con el consentimiento expreso del consumidor.',
      'El consumidor reconoce que perderá su derecho de desistimiento cuando el servicio se haya ejecutado completamente.',
    ],
    salesFooter:
      'Si el PDF no pudiera descargarse por un error técnico imputable al servicio, el usuario podrá solicitar la regeneración del informe o el reembolso en hola@regla183.com en un plazo de 48 horas.',
    liabilityTitle: '4. Limitación de responsabilidad',
    liabilityLead: 'TaxNomad no será responsable de:',
    liabilityList: [
      'Decisiones fiscales o legales tomadas basándose en el informe generado.',
      'Errores derivados de datos incorrectos o incompletos introducidos por el usuario.',
      'Cambios normativos posteriores a la fecha de generación del informe.',
      'Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor.',
    ],
    liabilityFooter:
      'En cualquier caso, la responsabilidad máxima de TaxNomad quedará limitada al importe abonado por el servicio contratado.',
    intellectualTitle: '5. Propiedad intelectual',
    intellectualBody: [
      'Todos los elementos del sitio web, incluidos diseño, código, textos, logotipos y la marca TaxNomad, son propiedad exclusiva del titular del servicio y están protegidos por la normativa aplicable.',
      'El informe PDF generado es de uso personal y exclusivo del usuario comprador. No puede ser revendido, redistribuido ni presentado como elaborado por un profesional fiscal colegiado.',
    ],
    lawTitle: '6. Legislación aplicable y resolución de disputas',
    lawBody: [
      'El presente contrato se rige por la legislación española. Para la resolución de controversias, ambas partes se someten a los juzgados y tribunales del domicilio del consumidor, conforme al artículo 90.2 del TRLGDCU.',
      'Los consumidores de la UE pueden acceder a la plataforma europea de resolución de litigios en línea (ODR) en ec.europa.eu/consumers/odr.',
    ],
    changesTitle: '7. Modificaciones de los términos',
    changesBody:
      'TaxNomad se reserva el derecho de modificar estos Términos de Servicio en cualquier momento. Los cambios se publicarán en esta página con la fecha de actualización correspondiente.',
  },
  en: {
    title: 'Terms of Service · TaxNomad',
    updatedAt: 'Last updated: April 20, 2026',
    heading: 'Terms of Service',
    intro: 'Legal terms governing the use of the TaxNomad service. Please read them before purchasing.',
    providerTitle: '1. Service provider identification',
    providerIntro:
      'In accordance with article 10 of Spain’s Law 34/2002 on Information Society Services and Electronic Commerce, the following information is provided:',
    providerList: [
      ['Owner', 'Antonio Ballesteros Alonso'],
      ['Tax ID', '08997554T'],
      ['Registered address', 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca, Spain'],
      ['Contact email', 'hola@regla183.com'],
      ['Website', 'regla183.com'],
    ],
    purposeTitle: '2. Service purpose and liability limitation',
    purposeBody: [
      'TaxNomad is a technical utility designed to help users calculate days of physical presence in Spain for informational purposes.',
      'The generated report does not constitute official legal or tax advice and does not replace consultation with a qualified advisor.',
      'The accuracy of the result depends entirely on the data entered by the user.',
    ],
    salesTitle: '3. Sales policy and withdrawal rights',
    salesBody: [
      'The Premium Report costs €9.99 (VAT included) and is delivered immediately in PDF format once payment is confirmed.',
      'Under article 16(m) of Directive 2011/83/EU and article 103(m) of Spain’s Royal Legislative Decree 1/2007, the 14-day withdrawal right does not apply to digital content supplied on a non-tangible medium once performance has begun with the consumer’s express consent.',
    ],
    salesList: [
      'Performance has started with the consumer’s express consent.',
      'The consumer acknowledges losing the right of withdrawal once the service has been fully performed.',
    ],
    salesFooter:
      'If the PDF cannot be downloaded due to a technical error attributable to the service, the user may request report regeneration or a refund at hola@regla183.com within 48 hours.',
    liabilityTitle: '4. Limitation of liability',
    liabilityLead: 'TaxNomad shall not be liable for:',
    liabilityList: [
      'Tax or legal decisions made based on the generated report.',
      'Errors derived from incomplete or incorrect user input.',
      'Regulatory changes introduced after the report generation date.',
      'Temporary service interruptions due to maintenance or force majeure.',
    ],
    liabilityFooter:
      'In any event, TaxNomad’s maximum liability shall be limited to the amount paid for the contracted service.',
    intellectualTitle: '5. Intellectual property',
    intellectualBody: [
      'All website elements, including design, code, texts, logos and the TaxNomad brand, are the exclusive property of the service owner and are protected by applicable intellectual property laws.',
      'The generated PDF report is for the exclusive personal use of the purchasing user. It may not be resold, redistributed or presented as professional tax advice.',
    ],
    lawTitle: '6. Governing law and dispute resolution',
    lawBody: [
      'This agreement is governed by Spanish law. Any dispute shall be submitted to the courts of the consumer’s domicile in accordance with applicable consumer protection rules.',
      'EU consumers may access the European Online Dispute Resolution platform at ec.europa.eu/consumers/odr.',
    ],
    changesTitle: '7. Changes to these terms',
    changesBody:
      'TaxNomad reserves the right to modify these Terms of Service at any time. Any change will be published on this page together with the updated revision date.',
  },
} as const;

export default function TermsOfService() {
  const { language, t } = useI18n();
  const content = contentByLanguage[language];

  return (
    <div className="premium-gradient min-h-screen text-foreground">
      <Helmet>
        <title>{content.title}</title>
      </Helmet>
      <Header />
      <main className="premium-section py-10">
        <Link to="/" className="metric-chip mb-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {t('legalBack')}
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <span className="premium-eyebrow">{content.updatedAt}</span>
            <h1 className="text-4xl font-[650] tracking-[-0.06em] sm:text-5xl">{content.heading}</h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{content.intro}</p>
          </div>

          <div className="space-y-6">
            <section className="double-shell">
              <div className="double-shell-core space-y-4 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <Scale className="h-6 w-6 text-primary" />
                  {content.providerTitle}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">{content.providerIntro}</p>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <div className="space-y-2 text-sm leading-7 text-muted-foreground">
                    {content.providerList.map(([label, value]) => (
                      <p key={label}>
                        <strong className="text-foreground">{label}:</strong> {value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="double-shell">
              <div className="double-shell-core space-y-4 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                  {content.purposeTitle}
                </h2>
                {content.purposeBody.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="double-shell">
                <div className="double-shell-core space-y-4 p-6 sm:p-8">
                  <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                    <CreditCard className="h-6 w-6 text-primary" />
                    {content.salesTitle}
                  </h2>
                  {content.salesBody.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                  <div className="space-y-3">
                    {content.salesList.map((item) => (
                      <div key={item} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {content.salesFooter.split('hola@regla183.com')[0]}
                    <a href="mailto:hola@regla183.com" className="text-primary underline underline-offset-4">
                      hola@regla183.com
                    </a>
                    {content.salesFooter.split('hola@regla183.com')[1]}
                  </p>
                </div>
              </section>

              <section className="double-shell">
                <div className="double-shell-core space-y-4 p-6 sm:p-8">
                  <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-red-500">
                    <AlertCircle className="h-6 w-6" />
                    {content.liabilityTitle}
                  </h2>
                  <p className="text-sm italic leading-7 text-muted-foreground">{content.liabilityLead}</p>
                  <div className="space-y-3">
                    {content.liabilityList.map((item) => (
                      <div key={item} className="rounded-[1.25rem] border border-red-500/15 bg-red-500/5 p-4 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{content.liabilityFooter}</p>
                </div>
              </section>
            </div>

            <section className="double-shell">
              <div className="double-shell-core space-y-4 p-6 sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">{content.intellectualTitle}</h2>
                {content.intellectualBody.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section className="double-shell">
              <div className="double-shell-core space-y-4 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <Globe className="h-6 w-6 text-primary" />
                  {content.lawTitle}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">{content.lawBody[0]}</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {content.lawBody[1].split('ec.europa.eu/consumers/odr')[0]}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                  {content.lawBody[1].split('ec.europa.eu/consumers/odr')[1]}
                </p>
              </div>
            </section>

            <section className="double-shell">
              <div className="double-shell-core space-y-4 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  {content.changesTitle}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">{content.changesBody}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
