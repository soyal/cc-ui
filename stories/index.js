import React from 'react';

import { storiesOf } from '@storybook/react';
import DemoButton from './demo/demo-button'

storiesOf('Demo', module)
  .add('button', () => <DemoButton></DemoButton>);
