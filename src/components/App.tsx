import "./App.css";
import { useEffect, useState } from "react";
import EditSeminar from "../components/edit-seminar/EditSeminar";
import { API_URL } from "../config";
import { Seminar } from "../types";

function App() {
    const [seminars, setSeminars] = useState<Seminar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(
        null
    );

    // Асинхронный запрос на получение списка семинаров при монтировании компонента
    useEffect(() => {
        const fetchSeminars = async () => {
            try {
                const response = await fetch(`${API_URL}`);
                if (!response.ok) {
                    throw new Error("Ошибка загрузки данных");
                }
                const data = await response.json();
                setSeminars(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSeminars();
    }, []);
    // Асинхронный запрос на удаление семинара по id
    const deleteSeminar = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Ошибка при удалении семинара");
            }
            setSeminars(seminars.filter((seminar) => seminar.id !== id));
        } catch (error: any) {
            setError(error.message);
        }
    };

    const openEditModal = (seminar: Seminar) => {
        setSelectedSeminar(seminar);
    };

    const closeEditModal = () => {
        setSelectedSeminar(null);
    };

    const updateSeminar = (updatedSeminar: Seminar) => {
        setSeminars(
            seminars.map((seminar) =>
                seminar.id === updatedSeminar.id ? updatedSeminar : seminar
            )
        );
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="seminars">
            <h1 className="seminars__title">Список семинаров</h1>
            <div className="seminars-list">
                {seminars.map((seminar) => (
                    <div key={seminar.id} className="seminars-list__item">
                        {/* <img src={seminar.photo} alt={seminar.title} />  Так как фото не подгружаются решил закомментировать*/}
                        <h2 className="seminars-list__title">
                            {seminar.title}
                        </h2>
                        <p className="seminars-list__description">
                            {seminar.description}
                        </p>
                        <p className="seminars-list__datetime">
                            Дата: {seminar.date} | Время: {seminar.time}
                        </p>
                        <div className="seminars-list__actions">
                            <button
                                className="seminars-list__button seminars-list__button_edit"
                                onClick={() => openEditModal(seminar)}
                            >
                                Редактировать
                            </button>
                            <button
                                className="seminars-list__button seminars-list__button_delete"
                                onClick={() => deleteSeminar(seminar.id)}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedSeminar && (
                <EditSeminar
                    seminar={selectedSeminar}
                    onClose={closeEditModal}
                    onUpdate={updateSeminar}
                />
            )}
        </div>
    );
}

export default App;
