"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlannedWorkout, WorkoutTemplate } from "@/types";
import { PlannedWorkoutGroups } from "./planned-workout-groups";
import { ScheduleWorkoutCard } from "./schedule-workout-card";
import { TemplateBuilderCard } from "./template-builder-card";
import { TemplateLibrary } from "./template-library";
import { usePlanWorkspace } from "./use-plan-workspace";

interface PlanWorkspaceProps {
  templates: WorkoutTemplate[];
  plannedWorkouts: PlannedWorkout[];
}

export function PlanWorkspace({
  templates,
  plannedWorkouts,
}: PlanWorkspaceProps) {
  const {
    isPending,
    draftItems,
    groupedWorkouts,
    scheduleDraft,
    templateDraft,
    addDraftItem,
    handleCreatePlannedWorkout,
    handleCreateTemplate,
    handleDuplicateTemplate,
    handleScheduleTemplateChange,
    moveDraftItem,
    updateDraftItem,
    updateScheduleDraft,
    updateTemplateDraft,
  } = usePlanWorkspace(templates, plannedWorkouts);

  return (
    <Tabs defaultValue="schedule">
      <TabsList className="bg-muted/40">
        <TabsTrigger value="schedule" className="cursor-pointer">
          Upcoming Schedule
        </TabsTrigger>
        <TabsTrigger value="templates" className="cursor-pointer">
          Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="schedule" className="mt-6 space-y-6">
        <ScheduleWorkoutCard
          isPending={isPending}
          scheduledDate={scheduleDraft.date}
          scheduledNotes={scheduleDraft.notes}
          scheduledTemplateId={scheduleDraft.templateId}
          scheduledTitle={scheduleDraft.title}
          templates={templates}
          onCreatePlannedWorkout={handleCreatePlannedWorkout}
          onScheduleTemplateChange={handleScheduleTemplateChange}
          onScheduledDateChange={(value) => updateScheduleDraft("date", value)}
          onScheduledNotesChange={(value) => updateScheduleDraft("notes", value)}
          onScheduledTitleChange={(value) => updateScheduleDraft("title", value)}
        />

        <PlannedWorkoutGroups groupedWorkouts={groupedWorkouts} />
      </TabsContent>

      <TabsContent value="templates" className="mt-6 space-y-6">
        <TemplateBuilderCard
          draftItems={draftItems}
          isPending={isPending}
          templateDescription={templateDraft.description}
          templateDuration={templateDraft.duration}
          templateGoalFocus={templateDraft.goalFocus}
          templateName={templateDraft.name}
          onAddDraftItem={addDraftItem}
          onCreateTemplate={handleCreateTemplate}
          onMoveDraftItem={moveDraftItem}
          onTemplateDescriptionChange={(value) =>
            updateTemplateDraft("description", value)
          }
          onTemplateDurationChange={(value) => updateTemplateDraft("duration", value)}
          onTemplateGoalFocusChange={(value) =>
            updateTemplateDraft("goalFocus", value)
          }
          onTemplateNameChange={(value) => updateTemplateDraft("name", value)}
          onUpdateDraftItem={updateDraftItem}
        />

        <TemplateLibrary
          isPending={isPending}
          templates={templates}
          onDuplicateTemplate={handleDuplicateTemplate}
        />
      </TabsContent>
    </Tabs>
  );
}
