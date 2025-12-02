'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
// import POST from '@/api/tasks/route';

export default function SimpleStudentManager() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  // state
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/students', { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const students = (data.students || []).map((t: any) => ({
          _id: String(t._id ?? t.id ?? ''),
          school: t.school ?? '',
          sex: t.sex ?? '',
          age: t.age ?? '—',
          G1: t.G1 ?? '—',
          G2: t.G2 ?? '—',
          G3: t.G3 ?? '—',
          ...t
        }));
        setStudents(students);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch students', err);
          setError('Failed to load records');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, []);

  // submit form to server API (server route at app/api/tasks/route.js)
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const payload: Record<string, any> = {};
    fd.forEach((v, k) => {
      // try to coerce numbers for some known fields
      if (['age','absences','G1','G2','G3'].includes(k)) {
        const n = Number(v);
        payload[k] = Number.isNaN(n) ? v : n;
      } else {
        payload[k] = v;
      }
    });

    try {
      const res = await fetch('/api/students/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        // reload list
        const json = await res.json();
        // re-fetch students
        const listRes = await fetch('/api/students');
        if (listRes.ok) {
          const listJson = await listRes.json();
          if (listJson.students) setStudents(listJson.students);
        }
      } else {
        console.error('Failed to create student', await res.json());
      }
    } catch (err) {
      console.error('Network error', err);
    }
  }


  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8">
      
      {/* 1. Minimal Header */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Student Records</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {showForm ? 'Close Form' : 'Add Student'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        
        {/* 2. Simple Form */}
        {showForm && (
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="font-bold mb-4 text-lg">New Entry</h2>
            <form ref={formRef} onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Personal Info */}
              <div className="col-span-2 md:col-span-4 border-b pb-2 mt-2 mb-2 text-sm font-bold text-gray-500 uppercase">
                Basic Info
              </div>
              <Input label="School" name="school" placeholder="GP or MS" />
              <Input label="Sex" name="sex" placeholder="F or M" />
              <Input label="Age" name="age" type="number" />
              <Input label="Address" name="address" placeholder="Urban/Rural" />
              
              {/* Family */}
              <div className="col-span-2 md:col-span-4 border-b pb-2 mt-4 mb-2 text-sm font-bold text-gray-500 uppercase">
                Family
              </div>
              <Input label="Mother's Job" name="Mjob" />
              <Input label="Father's Job" name="Fjob" />
              <Input label="Guardian" name="guardian" />
              <Input label="Family Size" name="famsize" />

              {/* Grades */}
              <div className="col-span-2 md:col-span-4 border-b pb-2 mt-4 mb-2 text-sm font-bold text-gray-500 uppercase">
                Performance
              </div>
              <Input label="Absences" name="absences" type="number" />
              <Input label="Grade 1" name="G1" type="number" />
              <Input label="Grade 2" name="G2" type="number" />
              <Input label="Final Grade (G3)" name="G3" type="number" className="border-blue-500" />

              <div className="col-span-2 md:col-span-4 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* 3. Clean Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">School</th>
                <th className="p-3 font-semibold">Sex</th>
                <th className="p-3 font-semibold">Age</th>
                <th className="p-3 font-semibold">Grades (G1/G2/G3)</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            {/* <tbody className="divide-y">
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{s._id}</td>
                  <td className="p-3">{s.school}</td>
                  <td className="p-3">{s.sex}</td>
                  <td className="p-3">{s.age}</td>
                  <td className="p-3 font-mono">
                    {s.G1} / {s.G2} / <span className="font-bold text-blue-600">{s.G3}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-gray-500 hover:text-blue-600 mr-3"><Edit2 size={16} /></button>
                    <button className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody className="divide-y">
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{String(s._id)}</td>
                  <td className="p-3">{s.school || '—'}</td>
                  <td className="p-3">{s.sex || '—'}</td>
                  <td className="p-3">{s.age ?? '—'}</td>
                  <td className="p-3 font-mono">
                    {s.G1 ?? '—'} / {s.G2 ?? '—'} / <span className="font-bold text-blue-600">{s.G3 ?? '—'}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-gray-500 hover:text-blue-600 mr-3"><Edit2 size={16} /></button>
                    <button className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 text-xs text-gray-500 bg-gray-50 border-t text-center">
            Showing all records
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper component for uniform inputs
function Input({ label, name, type = "text", className = "", placeholder = "" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input 
        type={type} 
        name={name}
        placeholder={placeholder}
        className={`border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black ${className}`} 
      />
    </div>
  );
}