import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Category } from "@/app/_types/Categories";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

interface Props {
  selectedCategories: Category[]; // 現在選ばれているカテゴリーのリスト
  setSelectedCategories: (categories: Category[]) => void; // 選ばれたカテゴリーを更新する関数
  categories: Category[]; // 利用可能なカテゴリーのリスト
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories, // 親コンポーネントから渡される選ばれたカテゴリー
  setSelectedCategories, // 親コンポーネントに渡されるカテゴリー更新関数
  categories, // 親コンポーネントから渡されるすべてのカテゴリー
}) => {
  // Supabaseセッションからトークンを取得
  const { token } = useSupabaseSession();

  // tokenが存在しない場合、何も表示せずリターン
  if (!token) return;

  // セレクトボックスで選択された値が変更されたときの処理
  const handleChange = (value: number[]) => {
    // 選ばれたIDのカテゴリーをフィルタリングして、新しいカテゴリーの配列を作成
    const updatedCategories = categories.filter((category) =>
      value.includes(category.id)
    );
    // 親コンポーネントに選ばれたカテゴリーを設定
    setSelectedCategories(updatedCategories);

  };

  return (
    <FormControl className="w-full">
      {/* MUIのSelectコンポーネントを使って、複数選択ができるセレクトボックスを表示 */}
      <Select
        multiple // 複数選択可能
        value={selectedCategories.map((category) => category.id)} // 選ばれたカテゴリーのIDをセレクトボックスの値として設定
        onChange={(e) => handleChange(e.target.value as number[])} // セレクトボックスで選択されたカテゴリーが変わったときに呼ばれる
        input={<OutlinedInput />} // セレクトボックスの入力フィールドをアウトライン付きに設定
        renderValue={(selected: number[]) => (
          // 選ばれたカテゴリーを画面上に表示する部分
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value: number) => {
              // 選ばれたカテゴリーのIDからカテゴリーを検索
              const category = categories.find((c) => c.id === value);
              // カテゴリーが見つかれば、そのカテゴリー名をChipとして表示
              return category ? (
                <Chip key={value} label={category.name} />
              ) : null;
            })}
          </Box>
        )}
      >
        {/* セレクトボックスの選択肢として表示するカテゴリーリスト */}
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name} {/* カテゴリー名を表示 */}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
