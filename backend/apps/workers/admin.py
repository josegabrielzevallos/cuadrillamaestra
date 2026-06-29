from django.contrib import admin

from .models import Category, Service, Worker


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name',)


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ('user', 'worker_type', 'category', 'work_zone',
                    'years_experience', 'is_verified', 'is_active')
    list_filter = ('worker_type', 'category', 'is_verified', 'is_active')
    search_fields = ('user__first_name', 'user__last_name', 'headline', 'work_zone')
    filter_horizontal = ('services',)
    list_editable = ('is_verified', 'is_active')
