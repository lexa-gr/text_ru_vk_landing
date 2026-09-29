import crossIcon from '../../assets/icons/cross.svg'
import crossWhiteIcon from '../../assets/icons/cross-white.svg'
import { cx } from '../../utils/cx'
import { Logo } from '../Logo/Logo'
import './LogoGroup.css'

type LogoGroupProps = {
  className?: string
  /** color — тёмные логотипы на светлом фоне (по умолчанию, как в хедере); white — для цветного фона. */
  variant?: 'color' | 'white'
}

/** «VK Реклама × Текст.ру» — компонент logo-group из Figma. */
export function LogoGroup({ className, variant = 'color' }: LogoGroupProps) {
  const vk = variant === 'white' ? 'vkWhite145' : 'vkColor145'
  const textru = variant === 'white' ? 'textruWhite95' : 'textruColor95'
  const cross = variant === 'white' ? crossWhiteIcon : crossIcon

  return (
    <div className={cx('logo-group', className)}>
      <Logo name={vk} className="logo-group__vk" />
      <img className="logo-group__cross" src={cross} width={15.016} height={15.016} alt="" />
      <Logo name={textru} className="logo-group__textru" />
    </div>
  )
}
