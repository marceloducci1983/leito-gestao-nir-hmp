
import { TransferTestResults } from './transferTestUtils';
import { DischargeTestResults } from './dischargeTestUtils';
import { DataIntegrityResults } from './dataIntegrityUtils';

export interface Phase2TestResults {
  transferResults: TransferTestResults;
  dischargeResults: DischargeTestResults;
  historicalDataCheck: DataIntegrityResults;
}
