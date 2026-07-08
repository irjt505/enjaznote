export interface Dictionary {
  nav: {
    home: string
    about: string
    services: string
    contact: string
    requestService: string
  }
  announcement: string
  hero: {
    title: string
    subtitle: string
    description: string
    cta: string
    cta2: string
    cta3: string
    badge: string
  }
  stats: {
    title: string
    years: string
    yearsValue: string
    clients: string
    clientsValue: string
    services: string
    servicesValue: string
    support: string
    supportValue: string
    hours: string
    hoursValue: string
  }
  about: {
    title: string
    subtitle: string
    description: string
    vision: { title: string; text: string }
    mission: { title: string; text: string }
    values: string
    valuesList: string[]
    story: {
      title: string
      paragraphs: string[]
    }
    team: {
      title: string
      members: { name: string; role: string; bio: string }[]
    }
    timeline: {
      title: string
      events: { year: string; title: string; desc: string }[]
    }
  }
  services: {
    title: string
    subtitle: string
    requestBtn: string
    searchPlaceholder: string
    noResults: string
    noResultsFor: string
    viewDetails: string
    orderNow: string
    orderViaWhatsapp: string
    notes: string
    notesPlaceholder: string
    otherServices: string
    needAnotherService: string
    needAnotherServiceDesc: string
    allServices: string
    customCategory: string
    customService: {
      title: string
      desc: string
      button: string
      inputPlaceholder: string
      send: string
      cancel: string
    }
    categories: {
      office: ServiceCategory
      student: ServiceCategory
      digital: ServiceCategory
      government: ServiceCategory
    }
    faq: {
      title: string
      items: { q: string; a: string }[]
    }
  }
  testimonials: {
    title: string
    subtitle: string
    close: string
    form: {
      title: string
      namePlaceholder: string
      textPlaceholder: string
      submit: string
      success: string
      ratingLabel: string
    }
    list: { name: string; text: string; stars: number }[]
  }
  contact: {
    title: string
    subtitle: string
    info: string
    address: string
    addressText: string
    addressNote: string
    phone: string
    phoneText: string
    phoneAlt: string
    email: string
    emailText: string
    hours: string
    hoursText: string
    hoursNote: string
    openNow: string
    closedNow: string
    schedule: { weekdays: string; weekend: string }
    mapUrl: string
    form: {
      title: string
      desc: string
      name: string
      email: string
      phone: string
      serviceType: string
      servicePlaceholder: string
      message: string
      submit: string
      success: string
      whatsapp: string
      printing: string
      scanning: string
      government: string
      student: string
      design: string
      other: string
    }
    social: {
      title: string
      snapchat: string
      tiktok: string
    }
    followUs: string
    cta: string
    ctaDesc: string
  }
  footer: {
    rights: string
    tagline: string
    quickLinks: string
    followUs: string
    subscribeTitle: string
    subscribePlaceholder: string
    subscribeBtn: string
    subscribeDesc: string
  }
  theme: {
    switchLang: string
  }
  backToTop: string
  notFound: {
    title: string
    description: string
    action: string
  }
  pageNotFound: string
  backToServices: string
  productNotFound: string
  backToCategory: string
}

export interface ServiceItem {
  name: string
  desc: string
  slug: string
}

export interface ServiceCategory {
  title: string
  desc: string
  items: ServiceItem[]
}
