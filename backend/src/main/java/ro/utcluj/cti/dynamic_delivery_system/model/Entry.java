package ro.utcluj.cti.dynamic_delivery_system.model;

public class Entry {
    private int from;
    private int until;
    boolean[] daysOfWeek; // 0 - Sunday, 1 - Monday, ..., 6 - Saturday

    // Foreign key to the Schedule entity
    // Many-to-one relationship with Schedule
    private Long scheduleId;

    // foreign object to the Location entity
    private Location location;

    public Entry(int from, int until, boolean[] daysOfWeek, Long scheduleId) {
        this.from = from;
        this.until = until;
        this.daysOfWeek = daysOfWeek;
        this.scheduleId = scheduleId;
    }




}
