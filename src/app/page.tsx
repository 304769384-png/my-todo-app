"use client";

import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";

// Todo 类型定义
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  // 默认待办列表（服务器端和客户端都使用）
  const defaultTodos: Todo[] = [
    { id: 1, text: "学习 Next.js", completed: false },
    { id: 2, text: "练习 TypeScript", completed: false },
    { id: 3, text: "完成 Todo 应用", completed: false },
  ];

  // 状态管理 - 初始使用默认数据（服务器端和客户端一致）
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [inputValue, setInputValue] = useState("");

  // 客户端挂载后从 localStorage 加载数据
  useEffect(() => {
    const loadTodos = (): Todo[] => {
      try {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : defaultTodos;
      } catch (error) {
        console.error('Failed to load todos:', error);
        return defaultTodos;
      }
    };

    const savedTodos = loadTodos();
    if (savedTodos.length !== todos.length || JSON.stringify(savedTodos) !== JSON.stringify(todos)) {
      setTodos(savedTodos);
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }, [todos]);

  // 添加待办
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(), // 使用时间戳作为唯一 ID
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue(""); // 清空输入框
    }
  };

  // 按回车键添加
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  // 删除待办
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 切换完成状态
  const handleToggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 计算未完成的待办数量
  const incompleteCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 mb-8">
          我的待办清单
        </h1>

        {/* 输入框和按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="今天要完成什么任务？"
            className="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-violet-400 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm transition-all"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-pink-700 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-violet-400 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            添加
          </button>
        </div>

        {/* 待办列表 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="px-6 py-4 hover:bg-gray-50/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-400 transition-all cursor-pointer"
                    />
                    <span 
                      className={`text-gray-700 transition-all duration-300 ${todo.completed ? 'line-through text-gray-400' : ''}`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-all duration-300 p-1 rounded-full hover:bg-red-50/50"
                    aria-label="删除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          {todos.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-violet-100">
                <ClipboardList className="h-8 w-8 text-violet-600" />
              </div>
              <p className="text-gray-500 mb-2">还没有待办事项</p>
              <p className="text-gray-400 text-sm">添加一个开始你的任务吧！</p>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="mt-4 text-center text-sm text-gray-600">
          共 {todos.length} 项待办，还剩 {incompleteCount} 项未完成
        </div>
      </div>
    </div>
  );
}
