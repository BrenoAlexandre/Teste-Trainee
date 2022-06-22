import classNames from 'classnames';
import { subYears } from 'date-fns';
import React, { useState } from 'react';
import Text from '../Text';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  cy: string;
  disabled: boolean;
  className?: string;
  label: string;
}

export const DateInput = ({
  cy,
  value,
  onChange,
  name,
  id,
  disabled,
  className,
  label,
}: IProps): React.ReactElement => {
  const [touched, setTouched] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const date = subYears(new Date(), 18);
  const maxDate = `${date.getFullYear()}-${
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate()}`;

  const handleIsInvalid = (): void => {
    if (touched && !value) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({
      ...e,
      target: {
        ...e.target,
        id,
        name,
      },
    });
  };

  return (
    <label htmlFor={id} className="w-100">
      {label}
      <input
        data-testid={cy}
        id={id}
        name={name}
        type="date"
        max={maxDate}
        pattern="(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/\d{4}"
        disabled={disabled}
        value={value || undefined}
        onChange={handleChange}
        onClick={() => setTouched(true)}
        onBlur={handleIsInvalid}
        className={classNames(`form-control ${isInvalid ? 'is-invalid' : ''} ${className}`)}
      />
      {isInvalid ? (
        <Text as="span" color="var(--red-500)" weight={500}>
          Campo Obrigatório
        </Text>
      ) : null}
    </label>
  );
};
