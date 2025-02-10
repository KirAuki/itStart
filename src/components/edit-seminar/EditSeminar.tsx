import { useForm } from "react-hook-form";
import { API_URL } from "../../config";
import { Seminar } from "../../types";
import "./EditSeminar.styles.css";

interface EditSeminarProps {
    seminar: Seminar;
    onClose: () => void;
    onUpdate: (updatedSeminar: Seminar) => void;
}

function EditSeminar({ seminar, onClose, onUpdate }: EditSeminarProps) {
    // Преобразование даты для корректного отображения в форме(иначе дата не подгружается в форму)
    const formattedDate = seminar.date
        ? seminar.date.split(".").reverse().join("-")
        : "";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Seminar>({
        defaultValues: {
            ...seminar,
            date: formattedDate,
        },
    });

    const onSubmit = async (data: Seminar) => {
        try {
            // Преобразование даты перед отправкой на сервер
            const formattedDate = data.date.split("-").reverse().join(".");

            const formattedData = {
                ...data,
                date: formattedDate,
            };
            // Асинхронный запрос на сервер с методом PUT
            const response = await fetch(`${API_URL}/${seminar.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error("Ошибка при обновлении семинара");
            }
            onUpdate(formattedData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="edit-seminar">
            <div className="edit-seminar__content">
                <h2 className="edit-seminar__title">Редактировать семинар</h2>
                <form
                    className="edit-seminar__form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label className="edit-seminar__label">
                        Название:
                        <input
                            className="edit-seminar__input"
                            type="text"
                            {...register("title", {
                                required: "Введите название",
                            })}
                        />
                        {errors.title && (
                            <p className="edit-seminar__error">
                                {errors.title.message}
                            </p>
                        )}
                    </label>

                    <label className="edit-seminar__label">
                        Описание:
                        <textarea
                            className="edit-seminar__textarea"
                            {...register("description", {
                                required: "Введите описание",
                            })}
                        />
                        {errors.description && (
                            <p className="edit-seminar__error">
                                {errors.description.message}
                            </p>
                        )}
                    </label>

                    <label className="edit-seminar__label">
                        Дата:
                        <input
                            className="edit-seminar__input"
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Ограничение даты сегодняшним числом
                            max={
                                new Date(
                                    new Date().setFullYear(
                                        new Date().getFullYear() + 1
                                    )
                                ) // Ограничение максимальной даты +1 год от текущей
                                    .toISOString()
                                    .split("T")[0]
                            }
                            {...register("date", { required: "Выберите дату" })}
                        />
                        {errors.date && (
                            <p className="edit-seminar__error">
                                {errors.date.message}
                            </p>
                        )}
                    </label>

                    <label className="edit-seminar__label">
                        Время:
                        <input
                            className="edit-seminar__input"
                            type="time"
                            {...register("time", {
                                required: "Выберите время",
                            })}
                        />
                        {errors.time && (
                            <p className="edit-seminar__error">
                                {errors.time.message}
                            </p>
                        )}
                    </label>

                    <div className="edit-seminar__actions">
                        <button
                            className="edit-seminar__button"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Сохранение..." : "Сохранить"}
                        </button>
                        <button
                            className="edit-seminar__button edit-seminar__button--cancel"
                            type="button"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSeminar;
