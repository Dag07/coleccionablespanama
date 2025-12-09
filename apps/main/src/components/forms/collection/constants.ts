export const COMMENTS_MODERATION_OPTIONS = [
  {
    title: 'Permitir todos',
    value: 'allow_all'
  },
  {
    title: 'Moderación automática',
    value: 'auto_moderation'
  },
  {
    title: 'Revisar todo',
    value: 'hold_all'
  },
  {
    title: 'Desactivado',
    value: 'disabled'
  }
]

export const COMMENTS_ORDER_OPTIONS = [
  {
    title: 'Más interesantes',
    value: 'interesting'
  },
  {
    title: 'Más recientes',
    value: 'newest'
  }
]

export const variants = {
  visible: {
    height: 'auto',
    transition: {
      duration: 0.2,
      delay: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  },
  hidden: {
    height: 0,
    transition: {
      duration: 0.2,
      delay: 0.2
      // staggerChildren: 0.1,
      // when: 'afterChildren',
      // staggerDirection: -1,
    }
  }
}

export const childVariants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.2
    }
  },
  hidden: {
    opacity: 0,
    className: 'pointer-events-none',
    transition: {
      duration: 0.2,
      delay: 0.1
    }
  }
}
