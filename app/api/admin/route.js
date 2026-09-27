import { NextResponse } from 'next/server';

let dbItems = [
  { id: '1', name: 'Nik Scythe', category: 'Ancient', subType: 'Knife', value: 120000, stock: 1, icon: '⚔️' },
  { id: '2', name: 'Harvester', category: 'Ancient', subType: 'Gun', value: 4300, stock: 3, icon: '🏹' },
  { id: '3', name: 'Corrupt', category: 'Unique', subType: 'Knife', value: 3200, stock: 2, icon: '🗡️' }
];

export async function GET() {
  return NextResponse.json({ success: true, items: dbItems });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { auth, action, payload } = body;

    if (auth !== 'siyoko2121') {
      return NextResponse.json({ success: false, error: 'Yetkisiz Erişim!' }, { status: 401 });
    }

    if (action === 'ADD_ITEM') {
      const newItem = { id: Date.now().toString(), ...payload };
      dbItems.push(newItem);
      return NextResponse.json({ success: true, items: dbItems });
    }

    if (action === 'DELETE_ITEM') {
      dbItems = dbItems.filter((item) => item.id !== payload.id);
      return NextResponse.json({ success: true, items: dbItems });
    }

    return NextResponse.json({ success: false, error: 'Geçersiz İşlem' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
