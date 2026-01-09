import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAlert } from '@/hooks/useAlert'
import { useFormData } from '@/hooks/useFormData'
import { useDetailProcess } from '@/hooks/useDetailProcess'
import { useDetailModal } from '@/hooks/useDetailModal'
import { useHourlyOutput } from '@/hooks/useHourlyOutput'
import { useHourValidation } from '@/hooks/useHourValidation' // 🆕 IMPORT
import { getJakartaTime } from '@/utils/dateTime'

// Components
import BreadCrumb from '@/components/common/BreadCrumb'
import HourlyOutputForm from '@/components/HourlyOutput/HourlyOutputForm'
import DetailProcessComponent from '@/components/HourlyOutput/DetailProcessComponent'
import OutputTable from '@/components/HourlyOutput/OutputTable'
import DetailModal from '@/components/HourlyOutput/DetailModal'
import UpdateModal from '@/components/HourlyOutput/UpdateModal'
import AlertComponent from '@/components/HourlyOutput/AlertComponent'
import Pagination from '@/components/common/Pagination'

const ITEMS_PER_PAGE = 10

export default function HourlyOutputPage() {
  const { user } = useAuth()

  // ⭐ Custom Hooks
  const alert = useAlert()
  const formHook = useFormData(user)
  const detailProcessHook = useDetailProcess(alert.showAlertMessage)
  const detailModalHook = useDetailModal(alert.showAlertMessage)
  const hourValidationHook = useHourValidation() // 🆕 ADD THIS
  const outputHook = useHourlyOutput(user, alert.showAlertMessage, detailProcessHook)

  // ⭐ UI State
  const [showForm, setShowForm] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)
  const [searchTerm, setSearchTerm] = useState('')

  // ⭐ Filter ORC List
  useEffect(() => {
    if (formHook.orcSearchTerm.trim() === '') {
      outputHook.setFilteredOrcList(outputHook.orcList)
    } else {
      const filtered = outputHook.orcList.filter(orc =>
        orc.orc.toLowerCase().includes(formHook.orcSearchTerm.toLowerCase()) ||
        orc.style.toLowerCase().includes(formHook.orcSearchTerm.toLowerCase()) ||
        orc.buyer.toLowerCase().includes(formHook.orcSearchTerm.toLowerCase())
      )
      outputHook.setFilteredOrcList(filtered)
    }
  }, [formHook.orcSearchTerm, outputHook.orcList])

  // ⭐ Load Initial Data (includes hour validation)
  useEffect(() => {
    const loadData = async () => {
      await outputHook.loadInitialData()
      // 🆕 Load used hours ketika page pertama kali mount
      await hourValidationHook.loadUsedHours()
    }
    loadData()
  }, [])

  // ⭐ Handle Form Submit (with validation)
  const handleFormSubmit = async () => {
    // 🆕 Check jam sudah terpakai sebelum submit
    if (formHook.formData.date && formHook.formData.hour) {
      const isUsed = hourValidationHook.isHourUsed(
        formHook.formData.date,
        formHook.formData.hour
      )
      if (isUsed) {
        alert.showAlertMessage(
          'error',
          'This hour is already used',
          [`Hour ${formHook.formData.hour} on ${formHook.formData.date} already has data`]
        )
        return
      }
    }

    const success = await outputHook.handleFormSubmit(
      formHook.formData,
      formHook.selectedOrc
    )
    if (success) {
      // ✅ Refresh validation setelah data baru ditambahkan
      await hourValidationHook.refreshValidation()
    }
  }

  // ⭐ Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false)
  }

  // ⭐ Handle Save Detail Process
  const handleSaveDetailProcess = async () => {
    const success = await outputHook.handleSaveDetailProcess(
      detailProcessHook.detailProcessData,
      detailProcessHook.detailProcessInput,
      detailProcessHook.currentHeaderData
    )
    if (success) {
      setCurrentPage(1)
      detailProcessHook.handleCancel()
      // 🆕 Refresh validation setelah save detail
      await hourValidationHook.refreshValidation()
    }
  }

  // ⭐ Handle Detail Click
  const handleDetailClick = async (idOutput) => {
    await detailModalHook.loadDetailData(idOutput)
  }

  // ⭐ Handle Update Click
  const handleUpdateClick = async (idOutput) => {
    await detailModalHook.loadUpdateData(idOutput)
  }

  // ⭐ Handle Save Update
  const handleSaveUpdate = async () => {
    const success = await detailModalHook.handleSaveUpdate(() => {
      outputHook.loadInitialData()
    })
    if (success) {
      setCurrentPage(1)
      // 🆕 Refresh validation setelah update
      await hourValidationHook.refreshValidation()
    }
  }

  // ⭐ Filter & Paginate Table
  const filteredOutputs = outputHook.outputs.filter(output =>
    (output.style?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (output.date?.includes(searchTerm)) ||
    (output.orc?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredOutputs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOutputs = filteredOutputs.slice(startIndex, startIndex + itemsPerPage)

  // ⭐ Breadcrumb Items
  const breadcrumbItems = [
    { label: 'Hourly Output', href: '/GI-HOL/hourly-output', active: true },
  ]

  return (
    <div className="space-y-6 px-6 py-8 bg-gray-50 min-h-screen">
      {/* ⭐ BREADCRUMB */}
      <BreadCrumb items={breadcrumbItems} />

      {/* ⭐ ALERT */}
      {alert.showAlert && (
        <AlertComponent
          type={alert.alertType}
          message={alert.alertMessage}
          details={alert.alertDetails}
        />
      )}

      {/* ⭐ FORM SECTION */}
      <HourlyOutputForm
        showForm={showForm}
        onToggleForm={setShowForm}
        formData={formHook.formData}
        setFormData={formHook.setFormData}
        selectedOrc={formHook.selectedOrc}
        orcSearchTerm={formHook.orcSearchTerm}
        setOrcSearchTerm={formHook.setOrcSearchTerm}
        showOrcDropdown={formHook.showOrcDropdown}
        setShowOrcDropdown={formHook.setShowOrcDropdown}
        filteredOrcList={outputHook.filteredOrcList}
        onOrcSelect={formHook.handleOrcSelect}
        onClearOrc={formHook.handleClearOrc}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseForm}
        loading={outputHook.loading}
        // 🆕 Pass validation props
        isHourUsed={hourValidationHook.isHourUsed}
        getAvailableHours={hourValidationHook.getAvailableHours}
        usedHours={hourValidationHook.usedHours}
      />

      {/* ⭐ DETAIL PROCESS SECTION */}
      {detailProcessHook.showDetailProcess && (
        <DetailProcessComponent
          detailProcessData={detailProcessHook.detailProcessData}
          detailProcessInput={detailProcessHook.detailProcessInput}
          currentHeaderData={detailProcessHook.currentHeaderData}
          loadingDetail={detailProcessHook.loadingDetail}
          loading={outputHook.loading}
          onActualOutputChange={detailProcessHook.handleActualOutputChange}
          onSaveDetailProcess={handleSaveDetailProcess}
          onCancelDetailProcess={detailProcessHook.handleCancel}
        />
      )}

      {/* ⭐ OUTPUT TABLE SECTION */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Output List</h3>
        <OutputTable
          data={paginatedOutputs}
          loading={outputHook.loading}
          onDetailClick={handleDetailClick}
          onUpdateClick={handleUpdateClick}
        />

        {/* ⭐ PAGINATION */}
        {!outputHook.loading && filteredOutputs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showInfo={true}
            itemsPerPage={itemsPerPage}
            totalItems={filteredOutputs.length}
          />
        )}
      </div>

      {/* ⭐ DETAIL MODAL */}
      <DetailModal
        isOpen={detailModalHook.showDetailModal}
        data={detailModalHook.detailData}
        loading={detailModalHook.loadingModal}
        onClose={detailModalHook.closeDetailModal}
      />

      {/* ⭐ UPDATE MODAL */}
      <UpdateModal
        isOpen={detailModalHook.showUpdateModal}
        data={detailModalHook.updateData}
        input={detailModalHook.updateInput}
        loading={detailModalHook.loadingModal}
        onInputChange={detailModalHook.handleUpdateInputChange}
        onSave={handleSaveUpdate}
        onClose={detailModalHook.closeUpdateModal}
      />
    </div>
  )
}