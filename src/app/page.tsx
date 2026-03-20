"use client";

import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          我的待办清单
        </h1>

        {/* 输入框和按钮 */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="添加新的待办事项..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            添加
          </button>
        </div>

        {/* 待办列表 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer" 
                    onClick={() => handleToggleComplete(todo.id)}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span 
                      className={`text-gray-700 transition-colors ${todo.completed ? 'line-through text-gray-400' : ''}`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
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
            <div className="px-6 py-12 text-center text-gray-500">
              暂无待办事项，添加一个开始吧！
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
