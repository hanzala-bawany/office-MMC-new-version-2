{/* <div>
        <label>
          <Typography.Text strong>{label}</Typography.Text>
        </label>
        <Field name={name}>
          {({ field, form }) => {
            const parsedDate = field.value
              ? parse(field.value, "dd-MM-yyyy", new Date())
              : null;

            return (
              <DatePicker
                selected={parsedDate && !isNaN(parsedDate) ? parsedDate : null}
                onChange={(date) => {
                  if (date) {
                    const formatted = format(date, "dd-MM-yyyy");
                    form.setFieldValue(name, formatted);
                  } else {
                    form.setFieldValue(name, ""); // or null if preferred
                  }
                }}
                wrapperClassName="w-full"
                placeholderText={placeholder}
                className="w-full !h-9 border px-3 py-2 rounded-md"
                dateFormat="dd-MM-yyyy"
                disabled={disabled}
              />
            );
          }}
        </Field>
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>




<InputFields label="Entry Time" type="time" name="entryTime" /> */}