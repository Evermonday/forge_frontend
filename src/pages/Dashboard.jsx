import { FormControl, FormLabel, TextField } from "@mui/material";
import { useState } from "react";

export default function Dashboard() {
  const fields = {
    name: '',
    note: '',
    status: ''
  }
  const [errors, setErrors] = useState(fields);
  const [formData, setFormData] = useState(fields);

  return (
    <div>
      <h2>General Information (DASHBOARD TEMP)</h2>
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          error={!!errors.name}
          helperText={errors.name}
          id="name"
          type="text"
          name="name"
          placeholder="Long Play"
          autoFocus
          required
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="note">Note</FormLabel>
        <TextField
          error={!!errors.note}
          helperText={errors.note}
          id="note"
          type="text"
          name="note"
          placeholder="Notes..."
          autoFocus
          fullWidth
          variant="outlined"
          value={formData.note}
          onChange={e => setFormData({...formData, note: e.target.value})}
        />
      </FormControl>
    </div>
  );
}
