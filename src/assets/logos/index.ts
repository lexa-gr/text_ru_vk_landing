import textruBrand102 from './logo-text-rw.svg'
import textruColor125 from './textru-color-125.svg'
import textruColor95 from './textru-color-95.svg'
import textruWhite102 from './textru-white-102.svg'
import textruWhite107 from './textru-white-107.svg'
import textruWhite163 from './textru-white-163.svg'
import textruWhite95 from './textru-white-95.svg'
import vkColor145 from './vk-color-145.svg'
import vkColor149 from './vk-color-149.svg'
import vkColor166 from './vk-color-166.svg'
import vkWhite145 from './vk-white-145.svg'
import vkWhite161 from './vk-white-161.svg'
import vkWhite165 from './vk-white-165.svg'
import vkWhite220 from './vk-white-220.svg'
import vkWhite226 from './vk-white-226.svg'

type LogoAsset = { src: string; width: number; height: number; alt: string }

const VK = 'VK Реклама'
const TEXTRU = 'Текст.ру'

/**
 * Имя = бренд + вариант (color — тёмный текст, white — белый, brand — фирменный: красный круг + белый
 * текст, для тёмных фонов, где нужен именно брендовый красный, а не монохром) + ширина в макете.
 */
export const logos = {
  vkColor145: { src: vkColor145, width: 145.103, height: 27.204, alt: VK },
  vkColor149: { src: vkColor149, width: 149, height: 28, alt: VK },
  vkColor166: { src: vkColor166, width: 166.438, height: 31.204, alt: VK },
  vkWhite145: { src: vkWhite145, width: 144.855, height: 27.204, alt: VK },
  vkWhite161: { src: vkWhite161, width: 161, height: 30, alt: VK },
  vkWhite165: { src: vkWhite165, width: 165, height: 31.059, alt: VK },
  vkWhite220: { src: vkWhite220, width: 220, height: 41, alt: VK },
  vkWhite226: { src: vkWhite226, width: 226, height: 42, alt: VK },
  textruBrand102: { src: textruBrand102, width: 102, height: 27, alt: TEXTRU },
  textruColor95: { src: textruColor95, width: 95.215, height: 25.127, alt: TEXTRU },
  textruColor125: { src: textruColor125, width: 125.529, height: 33.127, alt: TEXTRU },
  textruWhite95: { src: textruWhite95, width: 95.215, height: 25.127, alt: TEXTRU },
  textruWhite102: { src: textruWhite102, width: 102, height: 27, alt: TEXTRU },
  textruWhite107: { src: textruWhite107, width: 107, height: 28.237, alt: TEXTRU },
  textruWhite163: { src: textruWhite163, width: 163, height: 43, alt: TEXTRU },
} as const satisfies Record<string, LogoAsset>

export type LogoName = keyof typeof logos
export type LogoBrand = 'vk' | 'textru'

/** Бренд логотипа — для BEM-классов вида `price-card__logo-vk` / `price-card__logo-textru`. */
export function getLogoBrand(name: LogoName): LogoBrand {
  return name.startsWith('vk') ? 'vk' : 'textru'
}
