const columns = ['Action', 'Recommendation Status', 'Area', 'Zone', 'Bank',
'Stand', 'NetWin', 'Old Denom', 'New Denom', 'Old Payback %', 'New Payback %', 'Asset', 'Date'];

const visibleNames = ['Action', 'Status', 'Area', 'Zone', 'Bank', 'Stand', 'Net Win', 'Old Denom', 'New Denom', 'Old Payback %', 'New Payback %', 'Asset', 'Generated On'];

const sortTogether = ['Area', 'Zone', 'Bank', 'Stand'];

const groupCandidates = ['Bank', 'Area', 'Zone', 'Old Denom'];

export default {columns, visibleNames, sortTogether, groupCandidates};