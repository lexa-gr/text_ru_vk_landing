import type { ComponentPropsWithRef } from 'react'

import { cx } from '../../utils/cx'
import './Container.css'

export function Container({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('container', className)} {...rest} />
}
