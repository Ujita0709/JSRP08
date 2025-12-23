import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

const createUser = async (newUser) => {
  const res = await api.post("/users", newUser);
  return res.data;
};

export default function PracticeFinal() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 追加後に一覧を再取得
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (usersQuery.isLoading) return <p>Loading...</p>;
  if (usersQuery.isError) return <p>Error</p>;

  return (
    <div style={{ padding: 12 }}>
      <h2>React × Spring 連携（総合）</h2>

      <button
        onClick={() => createMutation.mutate({ name: "NewUser" })}
        disabled={createMutation.isPending}
      >
        追加
      </button>

      {createMutation.isPending && <p>送信中...</p>}
      {createMutation.isError && <p>追加に失敗しました</p>}
      {createMutation.isSuccess && <p>追加しました</p>}

      <hr />

      <ul>
        {usersQuery.data.map((u) => (
          <li key={u.id}>{u.id}: {u.name}</li>
        ))}
      </ul>
    </div>
  );
}
