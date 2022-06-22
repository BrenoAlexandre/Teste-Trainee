import classNames from 'classnames';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import Text from '../Text';

interface IProps {
  mask: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  cy: string;
  placeholder: string;
  disabled: boolean;
  msg: string | undefined;
  className?: string;
  label: string;
}

export const MaskedInput = ({
  mask,
  cy,
  value,
  onChange,
  name,
  id,
  placeholder,
  disabled,
  msg,
  className,
  label,
}: IProps): React.ReactElement => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    onChange({
      ...e,
      target: {
        ...e.target,
        id,
        name,
        value: String(e.target.value).replace(/[^\d]/g, ''),
      },
    });

  const [touched, setTouched] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleIsInvalid = (): void => {
    if (touched && value.length < 11) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };

  return (
    <label htmlFor={id} className="w-100">
      {label}
      <InputMask
        data-testid={cy}
        mask={mask}
        id={id}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onClick={() => setTouched(true)}
        onBlur={() => {
          handleIsInvalid();
        }}
        className={classNames(`form-control ${isInvalid ? 'is-invalid' : ''} ${className}`)}
      />
      {isInvalid ? (
        <Text as="span" color="var(--red-500)" weight={500}>
          {msg}
        </Text>
      ) : null}
    </label>
  );
};
