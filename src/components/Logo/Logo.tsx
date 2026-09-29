import { logos, type LogoName } from '../../assets/logos'

type LogoProps = {
  name: LogoName
  className?: string
}

export function Logo({ name, className }: LogoProps) {
  const { src, width, height, alt } = logos[name]
  return <img className={className} src={src} width={width} height={height} alt={alt} />
}
