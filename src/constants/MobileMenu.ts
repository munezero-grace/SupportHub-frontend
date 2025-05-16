  import { useState } from 'react'
  import { usePathname } from 'next/navigation'
  
  export const pathname = usePathname()
  export const [notifications] = useState(3)
  export const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
