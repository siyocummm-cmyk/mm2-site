'use client';
import React, { useState, useEffect } from 'react';
import { Settings, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('user');
  const [adminAuth, setAdminAuth] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState('');
  const [tradeStatus, setTradeStatus] = useState('');

  const [newItem, setNewItem] = useState({
    name: '', category: 'Godly', subType: 'Knife', value: 100, stock: 1, icon: '⚔️'
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) setInventory(data.items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminAuth === 'siyoko2121') {
      setIsAdminLoggedIn(true);
    } else {
      alert('Hatalı Şifre!');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth: 'siyoko2121', action: 'ADD_ITEM', payload: newItem })
    });
    const data = await res.json();
    if (data.success) {
      setInventory(data.items);
      setNewItem({ name: '', category: 'Godly', subType: 'Knife', value: 100, stock: 1, icon: '⚔️' });
    }
  };

  const handleDeleteItem = async (id) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth: 'siyoko2121', action: 'DELETE_ITEM', payload: { id } })
    });
    const data = await res.json();
    if (data.success) setInventory(data.items);
  };

  const toggleSelect = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const totalValue = selectedItems.reduce((acc, curr) => acc + Number(curr.value), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-xl">BloxSwaps MM2</span>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('user')} className={`px-4 py-2 rounded-xl text-sm ${activeTab === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Takas Paneli</button>
          <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-xl text-sm flex items-center gap-1 ${activeTab === 'admin' ? 'bg-rose-600' : 'bg-slate-800'}`}><Settings className="w-4 h-4" /> Admin</button>
        </div>
      </nav>

      {activeTab === 'user' ? (
        <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <input type="text" placeholder="Eşya Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-sm" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
                <div key={item.id} onClick={() => toggleSelect(item)} className={`cursor-pointer bg-slate-900 border ${selectedItems.some(i => i.id === item.id) ? 'border-indigo-500' : 'border-slate-800'} p-4 rounded-xl`}>
                  <div className="text-3xl text-center mb-2">{item.icon}</div>
                  <div className="font-bold text-sm truncate">{item.name}</div>
                  <div className="text-xs text-amber-400 font-bold mt-1">{item.value} Puan</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between h-[500px]">
            <div>
              <h3 className="font-bold border-b border-slate-800 pb-2">Seçilen Eşyalar</h3>
              <div className="mt-4 space-y-2">
                {selectedItems.map(i => <div key={i.id} className="flex justify-between text-xs bg-slate-950 p-2 rounded">{i.name} <span>{i.value} P</span></div>)}
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-amber-400 mb-4"><span>Toplam:</span><span>{totalValue} Puan</span></div>
              <button onClick={() => setTradeStatus('Takas isteği iletildi!')} className="w-full bg-indigo-600 font-bold py-3 rounded-xl text-sm">Takas Başlat</button>
              {tradeStatus && <p className="text-xs text-emerald-400 mt-2 text-center">{tradeStatus}</p>}
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-4xl mx-auto p-6">
          {!isAdminLoggedIn ? (
            <form onSubmit={handleAdminLogin} className="bg-slate-900 p-6 rounded-xl space-y-4 max-w-md mx-auto mt-10 border border-slate-800">
              <h2 className="font-bold text-lg text-center">Admin Girişi</h2>
              <input type="password" placeholder="Şifre" value={adminAuth} onChange={(e) => setAdminAuth(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm" />
              <button className="w-full bg-rose-600 font-bold py-3 rounded-xl text-sm">Giriş</button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleAddItem} className="bg-slate-900 p-6 rounded-xl space-y-3 border border-slate-800">
                <h3 className="font-bold">Yeni Silah/Kılıç Ekle</h3>
                <input type="text" placeholder="Eşya Adı" required value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-slate-950 p-2 rounded text-xs" />
                <input type="number" placeholder="Değer" required value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} className="w-full bg-slate-950 p-2 rounded text-xs" />
                <button className="w-full bg-indigo-600 font-bold py-2 rounded text-xs">Ekle</button>
              </form>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold mb-4">Veritabanı ({inventory.length})</h3>
                {inventory.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-950 p-2 rounded text-xs">
                    <span>{item.icon} {item.name} ({item.value} P)</span>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-rose-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
