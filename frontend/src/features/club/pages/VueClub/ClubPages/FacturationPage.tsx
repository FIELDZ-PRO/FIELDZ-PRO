import React, { useState } from 'react';
import { FileText, Download, Eye, Euro, Calendar, Filter } from 'lucide-react';
import './style/FacturationPage.css';

const FacturationPage = () => {
    const [invoices, setInvoices] = useState([
        {
            id: 'INV-2024-001',
            clientName: 'Pauline Dubois',
            date: '2024-04-18',
            amount: 40,
            status: 'Payée',
            dueDate: '2024-04-25',
            items: [{ description: 'Court 1 - Padel', quantity: 1, price: 40 }]
        },
        {
            id: 'INV-2024-002',
            clientName: 'Antoine Martin',
            date: '2024-04-16',
            amount: 70,
            status: 'En attente',
            dueDate: '2024-04-23',
            items: [{ description: 'Field 8 - Foot', quantity: 1, price: 70 }]
        },
        {
            id: 'INV-2024-003',
            clientName: 'Marie Leroy',
            date: '2024-04-19',
            amount: 120,
            status: 'Payée',
            dueDate: '2024-04-26',
            items: [
                { description: 'Court 1 - Padel', quantity: 2, price: 40 },
                { description: 'Court 3 - Synthétique', quantity: 1, price: 40 }
            ]
        },
        {
            id: 'INV-2024-004',
            clientName: 'Thomas Petit',
            date: '2024-04-20',
            amount: 140,
            status: 'En retard',
            dueDate: '2024-04-15',
            items: [{ description: 'Field 8 - Foot', quantity: 2, price: 70 }]
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('Toutes');
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Payée': return '#059669';
            case 'En attente': return '#d97706';
            case 'En retard': return '#dc2626';
            default: return '#64748b';
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        filterStatus === 'Toutes' || invoice.status === filterStatus
    );

    const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const paidAmount = filteredInvoices
        .filter(invoice => invoice.status === 'Payée')
        .reduce((sum, invoice) => sum + invoice.amount, 0);

    return (
        <div className="facturation-page">
            <div className="page-header">
                <h1>Facturation</h1>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-value">€{totalAmount}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">€{paidAmount}</span>
                        <span className="stat-label">Payé</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">€{totalAmount - paidAmount}</span>
                        <span className="stat-label">En attente</span>
                    </div>
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <Filter size={16} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="Toutes">Toutes les factures</option>
                        <option value="Payée">Payées</option>
                        <option value="En attente">En attente</option>
                        <option value="En retard">En retard</option>
                    </select>
                </div>
            </div>

            <div className="invoices-table">
                <div className="table-header">
                    <div>N° Facture</div>
                    <div>Client</div>
                    <div>Date</div>
                    <div>Échéance</div>
                    <div>Montant</div>
                    <div>Statut</div>
                    <div>Actions</div>
                </div>

                {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="table-row">
                        <div className="invoice-number">{invoice.id}</div>
                        <div className="client-name">{invoice.clientName}</div>
                        <div className="invoice-date">
                            {new Date(invoice.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="due-date">
                            {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="invoice-amount">€{invoice.amount}</div>
                        <div className="invoice-status">
                            <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(invoice.status) }}
                            >
                                {invoice.status}
                            </span>
                        </div>
                        <div className="invoice-actions">
                            <button
                                className="action-btn view"
                                onClick={() => setSelectedInvoice(invoice)}
                            >
                                <Eye size={16} />
                            </button>
                            <button className="action-btn download">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedInvoice && (
                <div className="modal-overlay">
                    <div className="modal invoice-modal">
                        <div className="modal-header">
                            <h2>Facture {selectedInvoice.id}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedInvoice(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="invoice-details">
                            <div className="invoice-info">
                                <div className="info-row">
                                    <span className="label">Client:</span>
                                    <span className="value">{selectedInvoice.clientName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Date:</span>
                                    <span className="value">
                                        {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Échéance:</span>
                                    <span className="value">
                                        {new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Statut:</span>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(selectedInvoice.status) }}
                                    >
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                            </div>

                            <div className="invoice-items">
                                <h3>Détails</h3>
                                <div className="items-table">
                                    <div className="items-header">
                                        <div>Description</div>
                                        <div>Quantité</div>
                                        <div>Prix unitaire</div>
                                        <div>Total</div>
                                    </div>
                                    {selectedInvoice.items.map((item: any, index: number) => (
                                        <div key={index} className="items-row">
                                            <div>{item.description}</div>
                                            <div>{item.quantity}</div>
                                            <div>€{item.price}</div>
                                            <div>€{item.quantity * item.price}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="invoice-total">
                                    <strong>Total: €{selectedInvoice.amount}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {filteredInvoices.length === 0 && (
                <div className="empty-state">
                    <FileText size={48} />
                    <h3>Aucune facture trouvée</h3>
                    <p>Aucune facture ne correspond à vos critères.</p>
                </div>
            )}
        </div>
    );
};

export default FacturationPage;