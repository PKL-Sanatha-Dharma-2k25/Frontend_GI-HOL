# 🐛 DEBUG GUIDE: Validation Error Fix

## ❌ Error yang Terjadi
```
Validation Error
Failed to save detail output
```

## 🔍 Langkah Debugging

### Step 1: Buka Browser Console
1. Tekan `F12` atau `Ctrl+Shift+I`
2. Buka tab **Console**
3. Clear console (klik icon 🚫 atau tekan `Ctrl+L`)

### Step 2: Coba Save Lagi
1. Isi data output di form
2. Klik tombol **"Save Details"**
3. Lihat console untuk log berikut:

### Step 3: Cari Log Ini di Console

#### A. Payload yang Dikirim
```javascript
💾 [storeDetailOutput] Saving detail output data...
💾 Payload: {
  "id_output": 123,
  "id_operation_breakdown": 456,
  "details": [...]
}
💾 Details count: 28
```

#### B. Validation Errors
```javascript
❌ Store detail output error: ...
❌ Error response: { ... }
❌ Error status: 422
❌ Validation errors: { ... }  ← PENTING!
❌ Backend message: "..."      ← PENTING!
```

---

## 🔧 Kemungkinan Penyebab & Solusi

### 1. ❌ Missing `id_employe`
**Gejala:**
```javascript
❌ Validation errors: {
  "details.0.id_employe": ["The id employe field is required"]
}
```

**Penyebab:** Field `empID` tidak ada di data dari `getDetailOutputByStyle`

**Solusi:** Cek response dari endpoint `/auth/getdetailoptob`

---

### 2. ❌ Missing `id_operation_breakdown`
**Gejala:**
```javascript
❌ Missing id_operation_breakdown in payload
```

**Penyebab:** Field `idob` tidak ada di data

**Solusi:** Cek field name yang benar dari backend

---

### 3. ❌ Empty Details Array
**Gejala:**
```javascript
❌ Missing or empty details array
```

**Penyebab:** Tidak ada data detail yang dikirim

**Solusi:** Pastikan ada minimal 1 output yang diisi

---

## 📋 Checklist Data yang Dibutuhkan

Dari response `/auth/getdetailoptob`, pastikan ada field:

```javascript
{
  "op_code": "2A",           ✅
  "op_name": "CHECK MOLD",   ✅
  "name": "TX-41",           ✅
  "target_per_day": 125,     ✅
  "empID": 3717,             ⚠️ HARUS ADA!
  "idob": 2599               ⚠️ HARUS ADA!
}
```

---

## 🔍 Cara Cek Response Backend

### 1. Cek di Console saat Load Detail
```javascript
🔍 Cari log ini:
 [getDetailOutputByStyle] Success response: {
   data: [
     {
       op_code: "2A",
       empID: ???,    ← Cek apakah ada
       idob: ???      ← Cek apakah ada
     }
   ]
 }
```

### 2. Cek Field Names
Kemungkinan nama field berbeda:
- `empID` vs `id_employee` vs `employee_id`
- `idob` vs `id_operation_breakdown` vs `operation_breakdown_id`

---

## 🛠️ Fix Berdasarkan Field Name

Jika field name berbeda, update di `useHourlyOutput.js` line 131:

### Jika `id_employee` (bukan `empID`):
```javascript
return {
  id_employe: detail.id_employee,  // ← Ganti dari empID
  output: out,
  ...
}
```

### Jika `id_operation_breakdown` (bukan `idob`):
```javascript
const detailPayload = {
  id_output: headerData.id_output,
  id_operation_breakdown: firstDetail.id_operation_breakdown,  // ← Ganti dari idob
  details: ...
}
```

---

## 📸 Screenshot yang Dibutuhkan

Tolong screenshot dan kirim:

1. **Console Error** - Bagian yang menunjukkan:
   ```
   ❌ Validation errors: { ... }
   ❌ Backend message: "..."
   ```

2. **Payload yang Dikirim** - Bagian:
   ```
   💾 Payload: { ... }
   ```

3. **Response dari getDetailOutputByStyle** - Bagian:
   ```
    [getDetailOutputByStyle] Success response: { ... }
   ```

---

## 🎯 Quick Fix Checklist

Setelah lihat console, cek:

- [ ] Apakah `id_output` ada di payload?
- [ ] Apakah `id_operation_breakdown` ada di payload?
- [ ] Apakah `details` array tidak kosong?
- [ ] Apakah setiap detail punya `id_employe`?
- [ ] Apakah field name sesuai dengan backend?

---

## 💡 Tips

1. **Jangan tutup console** saat testing
2. **Clear console** sebelum setiap test
3. **Copy semua log** untuk analisa
4. **Screenshot error** untuk dokumentasi

---

**Next Step:** Silakan coba save lagi dan kirim screenshot console error-nya! 📸
