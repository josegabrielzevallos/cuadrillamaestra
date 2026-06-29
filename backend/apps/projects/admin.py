from django.contrib import admin

from .models import Project, ProjectPhoto


class ProjectPhotoInline(admin.TabularInline):
    model = ProjectPhoto
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'worker', 'service', 'location', 'work_date')
    list_filter = ('service', 'work_date')
    search_fields = ('title', 'description', 'location')
    inlines = [ProjectPhotoInline]


@admin.register(ProjectPhoto)
class ProjectPhotoAdmin(admin.ModelAdmin):
    list_display = ('project', 'kind', 'caption')
    list_filter = ('kind',)
