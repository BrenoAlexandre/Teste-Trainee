import React from 'react';
import classNames from 'classnames';
import { FastField, Field } from 'formik';
import Text from '../Text';

interface IInput {
  cy: string;
  isInvalid?: boolean;
  msg?: string;
  className?: string;
  label?: string;
  id: string;
  name: string;
  as: string;
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  component?: string;
  type?: string;
}

const Input = ({
  cy,
  isInvalid,
  msg,
  className,
  label,
  id,
  name,
  as,
  placeholder,
  disabled,
  children,
  component,
  type,
}: IInput): React.ReactElement => (
  <label htmlFor={id} className="w-100">
    {label}
    {!children ? (
      <FastField
        cy={cy}
        as={as}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        component={component}
        className={classNames(`form-control ${isInvalid ? 'is-invalid' : ''} ${className}`)}
      />
    ) : (
      <Field
        cy={cy}
        as={as}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames(`form-control ${isInvalid ? 'is-invalid' : ''} ${className}`)}
        component={component}
      >
        {children}
      </Field>
    )}
    {isInvalid ? (
      <Text as="span" color="var(--red-500)" weight={500}>
        {msg}
      </Text>
    ) : null}
  </label>
);

Input.defaultProps = { isInvalid: false, msg: '', className: '', label: '', placeholder: '' };

export default Input;
