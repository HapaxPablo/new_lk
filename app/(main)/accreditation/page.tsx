import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Сведения об аккредитованной ИТ-компании АРЭМСИ24 | Реквизиты',
    description:
        'Информация об аккредитованной ИТ-компании ООО "АРЭМСИ 24". Реквизиты, технологический стек, виды деятельности ОКВЭД, данные для юридической работы.',
    keywords: 'аккредитованная ИТ-компания, АРЭМСИ, реквизиты, ИНН 2466158759, программное обеспечение, реестр IT-компаний',
    openGraph: {
        title: 'Сведения об аккредитованной ИТ-компании АРЭМСИ24',
        description: 'Полная информация о компании ООО "АРЭМСИ 24" для юридических целей и деловых контактов',
        type: 'website',
        url: 'https://krasrm.com/accreditation',
    },
}

export default function AccreditationPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ООО «АРЭМСИ 24»',
        alternateName: 'АРЭМСИ24',
        url: 'https://krasrm.com',
        logo: 'https://krasrm.com/logo.png',
        description: 'Аккредитованная ИТ-компания, разработчик программного обеспечения для автоматизации бизнес-процессов',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'ул. Красной Армии, 10, стр.3, оф.2-01',
            addressLocality: 'г. Красноярск',
            postalCode: '660017',
            addressCountry: 'RU'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+7-800-222-5938',
            contactType: 'Sales',
            email: 'info@krasrm.com'
        },
        sameAs: [
            'https://krasrm.com'
        ],
        taxID: '2466158759',
        identifier: '2466158759',
        foundingDate: '2022-05-19',
        knowsAbout: ['Программное обеспечение', 'Веб-приложения', 'IT-системы', 'Облачные решения'],
    }

    return (
        <main className="h-full bg-white overflow-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Заголовок */}
                <h1 className="text-4xl font-bold text-center mb-2">
                    Сведения об аккредитованной ИТ-компании
                </h1>
                <p className="text-center text-gray-600 mb-12">
                    Настоящая информация размещена во исполнение требований законодательства РФ,
                    предъявляемых к организациям, осуществляющим деятельность в области информационных
                    технологий и имеющим государственную аккредитацию.
                </p>

                {/* Раздел 1: Общие сведения */}
                <section className="mb-3 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Общие сведения об организации</h2>
                    <div className="space-y-4">
                        <div className="border-b pb-3">
                            <p className="text-gray-600 text-sm mb-1">Полное наименование:</p>
                            <p className="font-medium">ООО «АРЭМСИ 24»</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-gray-600 text-sm mb-1">Идентификационный номер налогоплательщика (ИНН):</p>
                            <p className="font-medium">2466158759</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-gray-600 text-sm mb-1">Код причины постановки на учет (КПП):</p>
                            <p className="font-medium">246601001</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-gray-600 text-sm mb-1">Юридический и фактический адрес:</p>
                            <p className="font-medium">660017 г. Красноярск, ул. Красной Армии, 10, стр.3, оф.2-01</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-gray-600 text-sm mb-1">Телефон:</p>
                            <p className="font-medium">8 (800) 222-59-38</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Адрес электронной почты:</p>
                            <p className="font-medium"><a href="mailto:info@krasrm.com" className="text-blue-600! hover:underline">info@krasrm.com</a></p>
                        </div>
                    </div>
                </section>

                {/* Раздел 2: ОКВЭД */}
                <section className="mb-12 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Основные виды экономической деятельности (ОКВЭД)</h2>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Основной вид:</span> 62.01 — Разработка компьютерного программного обеспечения
                        </p>
                        <p className="text-gray-700 text-sm">Дополнительные виды деятельности:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>60.10 — Деятельность в области радиовещания</li>
                            <li>59.20 — Деятельность в области звукозаписи и издания музыкальных произведений</li>
                            <li>60.20 — Деятельность в области телевизионного вещания</li>
                            <li>61.10 — Деятельность в области связи на базе проводных технологий</li>
                            <li>62.03 — Деятельность по управлению компьютерным оборудованием</li>
                            <li>62.09 — Деятельность, связанная с использованием вычислительной техники и информационных технологий, прочая</li>
                            <li>63.11 — Деятельность по обработке данных, предоставление услуг по размещению информации и связанная с этим деятельность</li>
                        </ul>
                    </div>
                </section>

                {/* Раздел 2.1: Виды деятельности в области ИТ */}
                <section className="mb-12 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Виды деятельности в области информационных технологий</h2>
                    <p className="text-sm text-gray-600 mb-6">в соответствии с приказом Минцифры России от 11.05.2023 № 449</p>
                    <ul className="list-disc list-inside space-y-4 text-gray-700">
                        <li><span className="font-medium">Код 12.01</span> — Оказание услуг с использованием собственных программ для ЭВМ и баз данных, включая предоставление удалённого доступа, для учёта и распространения рекламы в интернете</li>
                        <li><span className="font-medium">Код 8.01</span> — Услуги по оценке потребностей, сбору технических требований и реализации проектов автоматизации и цифровизации процессов</li>
                    </ul>
                </section>

                {/* Раздел 3: Аккредитация */}
                <section className="mb-12 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Аккредитация</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <p className="text-gray-800">
                            ООО «АРЭМСИ 24» зарегистрирована в реестре аккредитованных IT-компаний с <span className="font-semibold">19.05.2022</span>
                        </p>
                    </div>
                </section>

                {/* Раздел 4: Используемые технологии */}
                <section className="mb-12 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Используемые технологии</h2>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Основной стек (веб-приложение):</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><span className="font-medium">Frontend:</span> React, Next.js, TypeScript, Tailwind CSS</li>
                            <li><span className="font-medium">Backend:</span> Django, Django REST Framework, PostgreSQL</li>
                            <li><span className="font-medium">DevOps:</span> Docker, GitLab, CI/CD, Nginx</li>
                            <li><span className="font-medium">Интеграция:</span> 1C: Предприятие 8.3 (Управление торговлей, Бухгалтерия, Зарплата и т.д.)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Технологический стек АРЭМСИ24 Content Player:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Python 3.14 + PyQt6 (GUI) + VLC (медиа) + SQLite (БД) + aiohttp (API)</li>
                            <li>Windows: pycaw/comtypes (звук) | Linux: alsaaudio/PulseAudio</li>
                            <li>Сборка: PyInstaller (EXE)</li>
                        </ul>
                    </div>
                </section>

                {/* Раздел 5: Информация о стоимости товаров и услуг */}
                <section className="mb-12 border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Информация о стоимости товаров и услуг</h2>
                    <ul className="space-y-4 text-gray-700 list-disc list-inside">
                        <li>
                            Стоимость предоставления прав использования программного обеспечения АРЭМСИ24 определяется в соответствии с тарифными планами.
                        </li>
                        <li >
                            Актуальная информация о тарифах размещена по адресу:
                            <a href="https://krasrm.com/nomenclatures" className="text-blue-600! hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                                https://krasrm.com/nomenclatures
                            </a>
                        </li>
                        <li>
                            Тарификация осуществляется в форме абонентской платы за предоставление доступа к программному обеспечению.
                        </li>

                    </ul>
                </section>

                {/* Нижняя линия */}
                <div className="pt-8 text-center text-gray-600 text-sm">
                    <p>© 2026 ООО «АРЭМСИ 24». Все права защищены.</p>
                </div>
            </div>
        </main>
    )
}