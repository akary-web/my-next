import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Category } from "@/app/_types/Categories";
import { useEffect } from "react";

interface Props {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories = [], // 初期値を空の配列に設定
  setSelectedCategories,
}) => {
  const [categories, setCategories] = React.useState<Category[]>([]);

  const handleChange = (value: number[]) => {
    // 選択されたidの配列を基にselectedCategoriesを更新
    const updatedCategories = categories.filter((category) =>
      value.includes(category.id)
    );
    setSelectedCategories(updatedCategories);
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories");
      const { categories } = await res.json();
      setCategories(categories);
    };

    fetcher();
  }, []);

  return (
    <FormControl className="w-full">
      <Select
        multiple
        value={selectedCategories.map((category) => category.id)} // idの配列に変換
        onChange={(e) => handleChange(e.target.value as number[])}
        input={<OutlinedInput />}
        renderValue={(selected: number[]) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: number) => {
              const category = categories.find(c => c.id === value);
              return category ? (
                <Chip key={value} label={category.name} />
              ) : null;
            })}
          </Box>
        )}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
