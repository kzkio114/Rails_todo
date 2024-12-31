Rails.application.routes.draw do
  #resources :events, only: [:index], defaults: { format: :json }
  post 'toggle_theme', to: 'themes#toggle', as: :toggle_theme
  namespace :api do
    namespace :v1 do
      defaults format: :json do
        resources :tasks, only: [:create, :update, :destroy]
        resources :events, only: [:index]
      end
    end
  end

  resources :tasks, only: [ :index, :edit, :show, :new, :create, :update, :destroy ] do
    member do
      patch :task_detail_update
    end
  end
  #post '/tasks', to: 'tasks#create', defaults: { format: :json }
  root "tops#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
