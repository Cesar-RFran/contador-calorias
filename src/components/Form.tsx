import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react";
import { categories } from "../data/categories";
import { Activity } from '../types/index';
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";
import {v4 as uuidv4} from 'uuid'

export type FormProps = {
  dispatch: Dispatch<ActivityActions>,
  state: ActivityState,
}


const initianState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0
}

export default function Form({dispatch, state} : FormProps) {

    const [activity, setactivity] = useState<Activity>(initianState)

    useEffect(() => {
      if(state.activeId) {
        const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId )[0]
        setactivity(selectedActivity)
      }
    }, [state.activeId])
    


    const handleChange = (e:ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement> ) => {
      const isNumberField = ['category', 'calories'].includes(e.target.id)
      setactivity({
        ...activity,
        [e.target.id]: isNumberField ? +e.target.value : e.target.value
      })

    }

    const isValidiActivity = () => {
      const{name, calories} = activity
      return name.trim() !== '' && calories > 0
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch({type: "save-activity", payload: {newActivity: activity}})
        setactivity({
          ...initianState, 
          id: uuidv4()
        })

    }

  return (
    <form className="space-y-5 bg-white shadow p-10 rounded-lg"
    onSubmit={handleSubmit }
    >
      
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="category" className="font-bold">Categoría:</label>
            <select
              className="border border-slate-300 p-2 rounded-lg w-full bg-white"
              id="category"
              value={activity.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="name" className="font-bold">Actividad:</label>
            <input
              id="name"
              type="text"
              className="border border-slate-300 p-2 rounded-lg w-full bg-white"
              placeholder="Ej. Comida, Jugo de Naranja, Pesas, Bicicleta"
              value={activity.name}
              onChange={handleChange}

            />
        </div>

        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="calories" className="font-bold">Calorías:</label>
            <input
              id="calories"
              type="number"
              className="border border-slate-300 p-2 rounded-lg w-full bg-white"
              placeholder="Calorías Ej. 300 o 500"
              value={activity.calories}
              onChange={handleChange}

            />
        </div>

        <input 
          type="submit"
          className="bg-gray-800 hover:bg-gray-900 w-full p-2 uppercase text-white cursor-pointer disabled:opacity-10"
          value={activity.category == 1 ? 'Guardar comida' : 'guardar ejercicio' }
          disabled={!isValidiActivity()}
        />
    </form>
  );
}
