import React, { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Send, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

type TxType = 'deposit' | 'withdraw' | 'transfer' | 'funding';
type TxStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  sender: string;
  receiver: string;
  status: TxStatus;
  date: string;
}

const statusStyle: Record<TxStatus, { variant: 'success' | 'warning' | 'error'; icon: React.ReactNode }> = {
  completed: { variant: 'success', icon: <CheckCircle size={14} /> },
  pending: { variant: 'warning', icon: <Clock size={14} /> },
  failed: { variant: 'error', icon: <XCircle size={14} /> },
};

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(24500);
  const [modalType, setModalType] = useState<TxType | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'deposit', amount: 10000, sender: 'Bank Account', receiver: user?.name || 'You', status: 'completed', date: '2026-07-01' },
    { id: '2', type: 'funding', amount: 5000, sender: 'You', receiver: 'TechWave AI', status: 'completed', date: '2026-07-03' },
    { id: '3', type: 'withdraw', amount: 1200, sender: user?.name || 'You', receiver: 'Bank Account', status: 'pending', date: '2026-07-05' },
  ]);

  const openModal = (type: TxType) => {
    setModalType(type);
    setAmount('');
    setRecipient('');
  };

  const closeModal = () => setModalType(null);

  const submitTransaction = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: modalType!,
      amount: amt,
      sender: modalType === 'deposit' ? 'Bank Account' : (user?.name || 'You'),
      receiver: modalType === 'deposit' ? (user?.name || 'You') : (recipient || 'Bank Account'),
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTx, ...transactions]);

    if (modalType === 'deposit') setBalance(balance + amt);
    else setBalance(balance - amt);

    closeModal();
  };

  const modalTitles: Record<TxType, string> = {
    deposit: 'Deposit Funds',
    withdraw: 'Withdraw Funds',
    transfer: 'Transfer Funds',
    funding: 'Fund a Deal',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage your wallet, deposits, and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-highlight-600 to-highlight-800 border-0">
        <CardBody>
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-80 flex items-center gap-2">
                <Wallet size={16} /> Wallet Balance
              </p>
              <h2 className="text-3xl font-bold mt-1">${balance.toLocaleString()}</h2>
            </div>
            <TrendingUp size={40} className="opacity-30" />
          </div>
        </CardBody>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" leftIcon={<ArrowDownCircle size={18} />} onClick={() => openModal('deposit')}>
          Deposit
        </Button>
        <Button variant="outline" leftIcon={<ArrowUpCircle size={18} />} onClick={() => openModal('withdraw')}>
          Withdraw
        </Button>
        <Button variant="outline" leftIcon={<Send size={18} />} onClick={() => openModal('transfer')}>
          Transfer
        </Button>
        {user?.role === 'investor' && (
          <Button variant="highlight" leftIcon={<TrendingUp size={18} />} onClick={() => openModal('funding')}>
            Fund a Deal
          </Button>
        )}
      </div>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Sender</th>
                <th className="py-2 pr-4">Receiver</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 capitalize font-medium text-gray-900">{tx.type}</td>
                  <td className="py-3 pr-4">${tx.amount.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-gray-600">{tx.sender}</td>
                  <td className="py-3 pr-4 text-gray-600">{tx.receiver}</td>
                  <td className="py-3 pr-4 text-gray-600">{tx.date}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusStyle[tx.status].variant}>
                      <span className="flex items-center gap-1">
                        {statusStyle[tx.status].icon} {tx.status}
                      </span>
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">{modalTitles[modalType]}</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Amount ($)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
              />
              {(modalType === 'transfer' || modalType === 'funding') && (
                <Input
                  label={modalType === 'funding' ? 'Entrepreneur / Startup Name' : 'Recipient'}
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  fullWidth
                />
              )}
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="highlight" fullWidth onClick={submitTransaction}>
                  Confirm
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};