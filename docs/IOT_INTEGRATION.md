# Integrasi Endpoint IoT Synchronization

## 📍 Lokasi Implementasi

Endpoint `/auth/singkronisasiiot` telah diintegrasikan ke dalam:

### 1. **API Service** (`src/services/apiService.js`)
Fungsi baru: `getSyncIoTData(style, idLine)`

```javascript
export const getSyncIoTData = async (style, idLine) => {
  const params = { style, id_line: idLine }
  const response = await api.get('/auth/singkronisasiiot', { params })
  return response.data
}
```

### 2. **Detail Process Component** (`src/components/HourlyOutput/DetailProcessComponent.jsx`)

Tombol **"Fill from IoT"** sekarang menggunakan data real dari endpoint IoT.

#### Cara Kerja:
1. User mengklik tombol "Fill from IoT"
2. Sistem mengambil data dari endpoint dengan parameter:
   - `style`: dari `currentHeaderData.style`
   - `id_line`: dari `currentHeaderData.id_line`
3. Data IoT device di-mapping ke operations berdasarkan `op_code`
4. Field Output, Repair, dan Reject otomatis terisi

---

## 📊 Struktur Data

### Request
```
GET /auth/singkronisasiiot?style=TB3537&id_line=37
```

### Response
```json
{
  "success": 200,
  "message": "OK",
  "data": [
    {
      "id": 96,
      "device_id": "99",
      "id_employee": 3717,
      "op_code": "2A",
      "op_name": "CHECK MOLD",
      "target_per_day": 125,
      "name": "TX-41",
      "output": "0",
      "reject": "0",
      "repair": "0"
    },
    ...
  ]
}
```

### Mapping Logic
```javascript
// Untuk setiap IoT device dalam response
response.data.forEach(iotItem => {
  const opCode = iotItem.op_code
  
  // Cari operation yang matching
  const matchingOp = allData.find(item => item.op_code === opCode)
  
  if (matchingOp) {
    // Isi data dari IoT
    output[opCode] = parseInt(iotItem.output)
    repair[opCode] = parseInt(iotItem.repair)
    reject[opCode] = parseInt(iotItem.reject)
    deviceIds[opCode] = iotItem.device_id || iotItem.name
  }
})
```

---

## 🎨 **Tampilan Tabel**

Tabel Detail Process sekarang menampilkan kolom:

| Code | Process | Operator | **DEVICE ID** 🆕 | Target/Hour | Output | Repair | Reject |
|------|---------|----------|------------------|-------------|--------|--------|--------|
| 2A   | CHECK MOLD | TX-41 | **99** | 125 | 0 | 0 | 0 |
| 2B   | OVERLOCK | TX-42 | **75** | 130 | 7 | 7 | 9 |

**Kolom Device ID:**
- 🟣 Badge ungu dengan icon device
- Menampilkan `device_id` dari IoT
- Fallback ke `name` jika `device_id` kosong
- Tampil "-" jika tidak ada data IoT

---

## 🔄 Flow Integrasi

```
User Submit Form (HourlyOutputForm)
         ↓
handleFormSubmit (useHourlyOutput.js)
         ↓
setCurrentHeaderData({
  style: "TB3537",
  id_line: 37,
  date: "2024-01-29",
  hour: "08",
  ...
})
         ↓
DetailProcessComponent ditampilkan
         ↓
User klik "Fill from IoT"
         ↓
getSyncIoTData(style, id_line)
         ↓
Data IoT device diterima
         ↓
Mapping op_code → Output/Repair/Reject
         ↓
Form terisi otomatis
```

---

## ✅ Fitur

1. **Real-time IoT Data**: Mengambil data langsung dari device IoT
2. **Smart Mapping**: Otomatis mencocokkan op_code dari IoT dengan operations
3. **Error Handling**: Menampilkan pesan error jika:
   - Style atau id_line tidak tersedia
   - Tidak ada data IoT untuk style/line tersebut
   - Koneksi API gagal
4. **Visual Feedback**: 
   - Loading state saat fetch data
   - Success message dengan jumlah device yang berhasil dimuat
   - Error message jika gagal
5. **Console Logging**: Detailed logs untuk debugging

---

## 🎯 Penggunaan

### Di Halaman Hourly Output:
1. Pilih ORC/Style
2. Pilih Date & Hour
3. Submit form
4. Pada halaman Detail Process, klik **"Fill from IoT"**
5. Data otomatis terisi dari IoT devices

### Catatan:
- Endpoint membutuhkan parameter `style` dan `id_line`
- Data hanya akan terisi untuk op_code yang matching
- Jika ada IoT device dengan op_code yang tidak ada di operations, akan di-skip dengan warning di console

---

## 🐛 Debugging

Lihat console browser untuk log detail:
- 🔌 Prefix untuk IoT operations
- ✅ Untuk data yang berhasil dimapping
- ⚠️ Untuk IoT device yang tidak matching
- ❌ Untuk error

---

## 📝 File yang Dimodifikasi

1. ✅ `src/services/apiService.js` - Tambah fungsi `getSyncIoTData`
2. ✅ `src/components/HourlyOutput/DetailProcessComponent.jsx` - Update `handleFillFromIoT`

## 🔗 Dependencies

- `currentHeaderData` harus memiliki `style` dan `id_line`
- Backend endpoint: `/auth/singkronisasiiot`
- Response format harus sesuai dengan struktur yang didokumentasikan

---

**Status**: ✅ **IMPLEMENTED & READY TO USE**

**Last Updated**: 2026-01-29
