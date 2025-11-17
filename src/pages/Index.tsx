import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Order {
  id: string;
  customer: string;
  address: string;
  distance: string;
  price: number;
  status: 'new' | 'picked' | 'delivering';
  items: number;
}

interface Stats {
  today: number;
  week: number;
  month: number;
  earnings: number;
}

type Tab = 'orders' | 'history' | 'profile' | 'stats';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [showScanner, setShowScanner] = useState(false);

  const orders: Order[] = [
    {
      id: '#12847',
      customer: 'Анна Иванова',
      address: 'ул. Ленина, 42, кв. 15',
      distance: '2.3 км',
      price: 450,
      status: 'new',
      items: 3,
    },
    {
      id: '#12846',
      customer: 'Петр Сидоров',
      address: 'пр. Мира, 128, офис 201',
      distance: '4.1 км',
      price: 680,
      status: 'picked',
      items: 5,
    },
    {
      id: '#12845',
      customer: 'Мария Петрова',
      address: 'ул. Гагарина, 8, кв. 32',
      distance: '1.8 км',
      price: 320,
      status: 'delivering',
      items: 2,
    },
  ];

  const stats: Stats = {
    today: 12,
    week: 68,
    month: 284,
    earnings: 45600,
  };

  const history = [
    { id: '#12844', date: '16:45', earnings: 520, rating: 5 },
    { id: '#12843', date: '15:20', earnings: 380, rating: 5 },
    { id: '#12842', date: '14:10', earnings: 450, rating: 4 },
    { id: '#12841', date: '13:30', earnings: 620, rating: 5 },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500';
      case 'picked':
        return 'bg-orange-500';
      case 'delivering':
        return 'bg-green-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'Новый';
      case 'picked':
        return 'Забран';
      case 'delivering':
        return 'Доставляю';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Курьер</h1>
              <p className="text-sm opacity-90">Статус: В сети</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Icon name="Bell" size={20} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Icon name="MessageSquare" size={20} />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4">
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Активные заказы</h2>
                <Button
                  onClick={() => setShowScanner(!showScanner)}
                  size="sm"
                  className="gap-2"
                >
                  <Icon name="QrCode" size={18} />
                  Сканер
                </Button>
              </div>

              {showScanner && (
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-slide-up">
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg border-4 border-dashed border-primary/30 flex items-center justify-center">
                      <Icon name="QrCode" size={80} className="text-primary/40" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Наведите камеру на QR-код заказа
                    </p>
                  </div>
                </Card>
              )}

              {orders.map((order, index) => (
                <Card
                  key={order.id}
                  className="p-4 hover:shadow-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {order.price} ₽
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items} товара
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Icon
                        name="MapPin"
                        size={16}
                        className="text-muted-foreground mt-0.5 flex-shrink-0"
                      />
                      <p className="text-muted-foreground">{order.address}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon
                        name="Navigation"
                        size={16}
                        className="text-primary"
                      />
                      <span className="font-medium">{order.distance}</span>
                      <span className="text-muted-foreground">~12 мин</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {order.status === 'new' && (
                        <>
                          <Button className="flex-1 gap-2">
                            <Icon name="Check" size={18} />
                            Принять
                          </Button>
                          <Button variant="outline" size="icon">
                            <Icon name="Navigation" size={18} />
                          </Button>
                        </>
                      )}
                      {order.status === 'picked' && (
                        <>
                          <Button className="flex-1 gap-2 bg-accent hover:bg-accent/90">
                            <Icon name="Truck" size={18} />
                            Начать доставку
                          </Button>
                          <Button variant="outline" size="icon">
                            <Icon name="Navigation" size={18} />
                          </Button>
                        </>
                      )}
                      {order.status === 'delivering' && (
                        <>
                          <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                            <Icon name="CheckCircle" size={18} />
                            Завершить
                          </Button>
                          <Button variant="outline" size="icon">
                            <Icon name="Phone" size={18} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold">История заказов</h2>
              <div className="grid gap-3">
                {history.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{item.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Сегодня, {item.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +{item.earnings} ₽
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold">Статистика</h2>
              
              <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
                <div className="space-y-2">
                  <p className="text-sm opacity-90">Заработано за месяц</p>
                  <p className="text-4xl font-bold">{stats.earnings.toLocaleString()} ₽</p>
                  <Progress value={65} className="h-2 bg-white/20" />
                  <p className="text-xs opacity-75">65% от цели (70 000 ₽)</p>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center">
                  <Icon name="Package" size={24} className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{stats.today}</p>
                  <p className="text-xs text-muted-foreground">Сегодня</p>
                </Card>
                <Card className="p-4 text-center">
                  <Icon name="TrendingUp" size={24} className="mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{stats.week}</p>
                  <p className="text-xs text-muted-foreground">За неделю</p>
                </Card>
                <Card className="p-4 text-center">
                  <Icon name="Award" size={24} className="mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{stats.month}</p>
                  <p className="text-xs text-muted-foreground">За месяц</p>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-bold mb-4">Доставки по дням</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Пн', count: 8, percent: 40 },
                    { day: 'Вт', count: 12, percent: 60 },
                    { day: 'Ср', count: 15, percent: 75 },
                    { day: 'Чт', count: 11, percent: 55 },
                    { day: 'Пт', count: 14, percent: 70 },
                    { day: 'Сб', count: 18, percent: 90 },
                    { day: 'Вс', count: 10, percent: 50 },
                  ].map((item) => (
                    <div key={item.day} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{item.day}</span>
                      <div className="flex-1">
                        <Progress value={item.percent} className="h-2" />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                    АС
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Алексей Смирнов</h2>
                    <p className="text-sm text-muted-foreground">ID: C-45892</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">4.9</span>
                      <span className="text-sm text-muted-foreground">(284 отзыва)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Телефон</span>
                    <span className="font-medium">+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Транспорт</span>
                    <span className="font-medium">Велосипед</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Опыт работы</span>
                    <span className="font-medium">8 месяцев</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold mb-3">Настройки</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Icon name="Settings" size={18} />
                    Настройки профиля
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Icon name="CreditCard" size={18} />
                    Способы оплаты
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Icon name="HelpCircle" size={18} />
                    Помощь
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
                    <Icon name="LogOut" size={18} />
                    Выйти
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
          <div className="max-w-md mx-auto flex justify-around p-2">
            {[
              { id: 'orders' as Tab, icon: 'Package', label: 'Заказы' },
              { id: 'history' as Tab, icon: 'Clock', label: 'История' },
              { id: 'stats' as Tab, icon: 'BarChart3', label: 'Статистика' },
              { id: 'profile' as Tab, icon: 'User', label: 'Профиль' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon as any} size={22} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Index;