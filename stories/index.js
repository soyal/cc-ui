import React from 'react'

import { storiesOf } from '@storybook/react'
import DemoButton from './demo/demo-button'
import DemoTable from './demo/demo-table'
import DemoModal from './demo/demo-modal'
import DemoGmap from './demo/demo-gmap'
import DemoBmap from './demo/demo-bmap'
import DemoKeywords from './demo/demo-keywords'
import DemoTabs from './demo/demo-tabs'
import DemoPagination from './demo/demo-pagination'
import DemoSelect from './demo/demo-select'
import DemoCheckbox from './demo/demo-checkbox'
import DemoRadio from './demo/demo-radio'
import DemoSpin from './demo/demo-spin'
import DemoHeader from './demo/demo-header'

storiesOf('Demo', module)
  .add('button', () => <DemoButton />)
  .add('table', () => <DemoTable />)
  .add('modal', () => <DemoModal />)
  .add('gmap', () => <DemoGmap />)
  .add('bmap', () => <DemoBmap />)
  .add('keywords', () => <DemoKeywords />)
  .add('pagination', () => <DemoPagination />)
  .add('tabs', () => <DemoTabs />)
  .add('select', () => <DemoSelect />)
  .add('checkbox', () => <DemoCheckbox />)
  .add('radio', () => <DemoRadio />)
  .add('spin', () => <DemoSpin />)
  .add('common header', () => <DemoHeader />)
