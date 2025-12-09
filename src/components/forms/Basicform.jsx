import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function BasicForm({
  title = 'Form',
  fields = [],
  onSubmit = () => {},
  submitText = 'Submit',
  loading = false,
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      
      <div className="space-y-4">
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            error={errors[field.name]}
            required={field.required}
          />
        ))}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-6"
        loading={loading}
      >
        {submitText}
      </Button>
    </form>
  );
}
