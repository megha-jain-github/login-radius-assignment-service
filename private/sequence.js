// ---------------------------------- Generate Sequence Start ------------------------------------------//

import { get as _get, flow as _flow } from 'lodash';

const metaData = {
    Customer: {
        sequenceStarting: 'C_',
    },
    Order: {
        sequenceStarting: 'O_',
    },
    SalesInvoice: {
        sequenceStarting: 'SI_',
    },
    Package: {
        sequenceStarting: 'PACK_',
    },
    LabCustomer: {
        sequenceStarting: 'LABC_',
    },
    LabAdmin: {
        sequenceStarting: 'LABA_',
    },
    CompanyAdmin: {
        sequenceStarting: 'CA_',
    },
    LabSampler: {
        sequenceStarting: 'LABS_',
    },
};

const generateRandomNumber = () => Math.floor((Math.random() * 100) + (Math.random() * 10));

const generateSequence = data => `${data}${generateRandomNumber()}${new Date().getTime()}`;

const getRoleData = data => _get(metaData, data);

const getRoleParameter = data => _get(data, 'sequenceStarting');

const sequence = _flow(getRoleData, getRoleParameter, generateSequence);

const generateId = ({ role }) => sequence(role);

export default generateId;
export { generateId };
