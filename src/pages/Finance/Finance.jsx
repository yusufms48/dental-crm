import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addPayment,
  updatePayment,
  deletePayment,
} from "../../features/payments/paymentsSlice";
import { PRICE_LIST } from "../../utils/priceList";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import PatientSearch from "../../components/PatientSearch/PatientSearch";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../hooks/useToast";

export default function Finance() {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payments.payments);
  const patients = useSelector((state) => state.patients.patients);
  const appointments = useSelector((state) => state.appointments.appointments);

  const { toast, showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({
    appointmentId: "",
    patientId: "",
    services: [],
    status: "unpaid",
  });

  const allServices = PRICE_LIST.flatMap((cat) =>
    cat.services.map((s) => ({ ...s, category: cat.category })),
  );

  const getPatientName = (id) => {
    const p = patients.find((p) => p.id === id);
    return p ? p.name : "Неизвестен";
  };

  const getTotal = (services) => services.reduce((sum, s) => sum + s.price, 0);

  const addService = (service) => {
    setForm({ ...form, services: [...form.services, service] });
  };

  const removeService = (index) => {
    const updated = form.services.filter((_, i) => i !== index);
    setForm({ ...form, services: updated });
  };

  const openAdd = () => {
    setEditingPayment(null);
    setForm({
      appointmentId: "",
      patientId: "",
      services: [],
      status: "unpaid",
    });
    setShowModal(true);
  };

  const openEdit = (payment) => {
    setEditingPayment(payment);
    setForm({
      appointmentId: payment.appointmentId,
      patientId: payment.patientId,
      services: payment.services,
      status: payment.status,
    });
    setShowModal(true);
  };

  const handlePatientChange = (patientId) => {
    setForm({ ...form, patientId, appointmentId: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patientId || form.services.length === 0) return;
    if (editingPayment) {
      dispatch(updatePayment({ ...editingPayment, ...form }));
      showToast("Счёт обновлён");
    } else {
      dispatch(addPayment({ id: uuidv4(), ...form }));
      showToast("Счёт добавлен");
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    dispatch(deletePayment(confirmId));
    setConfirmId(null);
    showToast("Счёт удалён", "error");
  };

  const patientAppointments = appointments.filter(
    (a) => a.patientId === form.patientId,
  );

  const totalUnpaid = payments
    .filter((p) => p.status === "unpaid")
    .reduce((sum, p) => sum + getTotal(p.services), 0);

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + getTotal(p.services), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
          Финансы
        </h1>
        <button
          onClick={openAdd}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#38bdf8" }}
        >
          + Новый счёт
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Оплачено</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {totalPaid} AZN
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Не оплачено</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {totalUnpaid} AZN
          </p>
        </div>
      </div>

      {/* Список счетов */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Счетов пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {getPatientName(payment.patientId)}
                </p>
                <p className="text-sm text-gray-500">
                  {payment.services.map((s) => s.name).join(", ")}
                </p>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: "#38bdf8" }}
                >
                  {getTotal(payment.services)} AZN
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    payment.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {payment.status === "paid" ? "Оплачено" : "Не оплачено"}
                </span>
                <button
                  onClick={() => openEdit(payment)}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  Изменить
                </button>
                <button
                  onClick={() => setConfirmId(payment.id)}
                  className="text-xs px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <ConfirmModal
          message="Удалить этот счёт?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {showModal && (
        <Modal
          title={editingPayment ? "Редактировать счёт" : "Новый счёт"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пациент *
              </label>
              <PatientSearch
                patients={patients}
                value={form.patientId}
                onChange={(id) => handlePatientChange(id)}
              />
            </div>

            {form.patientId && patientAppointments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Визит
                </label>
                <select
                  value={form.appointmentId}
                  onChange={(e) =>
                    setForm({ ...form, appointmentId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Не привязывать к визиту</option>
                  {patientAppointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.date.split("-").reverse().join(".")} — {a.reason}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Услуги *
              </label>
              <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg">
                {PRICE_LIST.map((category) => (
                  <div key={category.category}>
                    <div
                      className="px-3 py-2 text-xs font-bold text-white sticky top-0"
                      style={{ backgroundColor: "#0f172a" }}
                    >
                      {category.category}
                    </div>
                    {category.services.map((service) => (
                      <div
                        key={service.name}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-t border-gray-100"
                      >
                        <span className="text-sm text-gray-700">
                          {service.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {service.price} AZN
                          </span>
                          <button
                            type="button"
                            onClick={() => addService(service)}
                            className="w-6 h-6 rounded-full text-white text-sm font-bold flex items-center justify-center hover:opacity-80"
                            style={{ backgroundColor: "#38bdf8" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {form.services.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Выбрано:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.services.map((s, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: "#38bdf8" }}
                      >
                        {s.name} — {s.price} AZN
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="ml-1 hover:opacity-70 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <p
                    className="text-sm font-semibold pt-2"
                    style={{ color: "#38bdf8" }}
                  >
                    Итого: {getTotal(form.services)} AZN
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус оплаты
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unpaid">Не оплачено</option>
                <option value="paid">Оплачено</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 text-white py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#38bdf8" }}
              >
                {editingPayment ? "Сохранить" : "Добавить"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
