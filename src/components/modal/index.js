import React, { memo } from 'react';
import {
  withGlobalDialogs as wG,
  useDialogMethods as uD,
  Dialog as Dia,
} from './dialogs';

export const withGlobalDialogs = wG;

export const useDialogMethods = uD;

export const Dialog = Dia;
