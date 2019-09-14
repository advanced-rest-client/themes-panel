import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

h2 {
  font-size: var(--arc-font-headline-font-size);
  font-weight: var(--arc-font-headline-font-weight);
  letter-spacing: var(--arc-font-headline-letter-spacing);
  line-height: var(--arc-font-headline-line-height);
}

h3 {
  font-size: var(--arc-font-subhead-font-size);
  font-weight: var(--arc-font-subhead-font-weight);
  line-height: var(--arc-font-subhead-line-height);
}

.error-toast {
  background-color: var(--warning-primary-color, #FF7043);
  color: var(--warning-contrast-color, #fff);
}

.add-form {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.add-form anypoint-input {
  flex: 1;
}

.selection-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.remove-theme {
  margin-left: 8px;
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}
`;
