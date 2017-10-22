import React from 'react';

import { storiesOf } from '@storybook/react';
import DemoButton from './demo/demo-button'
import DemoTable from './demo/demo-table'
import DemoModal from './demo/demo-modal'

storiesOf('Demo', module)
  .add('button', () => <DemoButton></DemoButton>)
  .add('table', () => <DemoTable></DemoTable>)
  .add('modal', () => <DemoModal></DemoModal>)
