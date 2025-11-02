import styled from 'styled-components';
import type { CurrencyRate } from './exchange/currencyRate';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Flag } from './country/Flag';

const RateItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const RateValue = styled.span`
  font-weight: 600;
  color: #111827;
`;

const Header = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #111827;
`;

export function RatesList({ rates }: { rates: CurrencyRate[] }) {
  return (
    <Card data-testid="rates-list">
      <Header>Exchange rates</Header>
      {rates.map((rate) => (
        <RateItem key={rate.code} data-testid="rate-item">
          <Badge>
            <Flag countryCode={rate.code} size={48} />
          </Badge>
          <RateValue>
            {rate.amount}{rate.code} : {rate.rate}CZK
          </RateValue>
        </RateItem>
      ))}
    </Card>
  );
}
